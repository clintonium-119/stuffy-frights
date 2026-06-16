/**
 * Authoring-time checks for the hand-authored mansion. Catches the failure modes
 * a 0.5 m edge author hits before they reach an in-browser walkthrough:
 *
 *  - `disconnected` — a walkable region unreachable from the rest of the house
 *    (secret edges are treated as open, so the only true islands are real gaps).
 *  - `unenclosed`   — a room cell open to the void through a `none` edge (a leak
 *    to the outside; the perimeter wasn't walled).
 *  - `dangling-door`— a `door`/`secret` edge with a non-walkable cell on one
 *    side (a doorway into nothing).
 *  - `misaligned`   — a stair column whose cells aren't `stair` on both floors it
 *    joins, or a chute whose mouth and landing aren't vertically aligned.
 *
 * Dev/authoring only; pairs with `build.ts`. Returns an empty array for clean
 * data.
 */
import { House, isWalkable } from '../layoutTypes';
import { blocksMovement, edgeBetween } from '../edges';

export type IssueKind = 'disconnected' | 'unenclosed' | 'dangling-door' | 'misaligned';

export interface ValidationIssue {
  kind: IssueKind;
  message: string;
  floor?: number;
  x?: number;
  z?: number;
}

interface Node {
  floor: number;
  x: number;
  z: number;
}

const ORTHO: ReadonlyArray<readonly [number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const key = (f: number, x: number, z: number): string => `${f}:${x},${z}`;

function walkable(house: House, f: number, x: number, z: number): boolean {
  if (x < 0 || z < 0 || x >= house.width || z >= house.depth) return false;
  if (f < 0 || f >= house.grids.length) return false;
  return isWalkable(house.grids[f][z][x]);
}

/**
 * Undirected traversal neighbours for the connectivity check: orthogonal
 * walkable cells joined by a passable edge (secret edges treated as open), the
 * stair runs (within-run cells on each floor + entrance↔landing across floors),
 * and chute drops (undirected here — we only care that the region is reachable).
 */
function neighbours(house: House, n: Node): Node[] {
  const out: Node[] = [];
  for (const [dx, dz] of ORTHO) {
    const x = n.x + dx;
    const z = n.z + dz;
    if (!walkable(house, n.floor, x, z)) continue;
    if (blocksMovement(edgeBetween(house, n.floor, n, { x, z }), true)) continue;
    out.push({ floor: n.floor, x, z });
  }
  for (const stair of house.stairs) {
    const low = stair.cells[0];
    const high = stair.cells[stair.cells.length - 1];
    if (n.floor === stair.lower && n.x === low.x && n.z === low.z) {
      out.push({ floor: stair.upper, x: high.x, z: high.z });
    }
    if (n.floor === stair.upper && n.x === high.x && n.z === high.z) {
      out.push({ floor: stair.lower, x: low.x, z: low.z });
    }
    for (let i = 0; i < stair.cells.length - 1; i++) {
      for (const fl of [stair.lower, stair.upper]) {
        const a = stair.cells[i];
        const b = stair.cells[i + 1];
        if (n.floor === fl && n.x === a.x && n.z === a.z) out.push({ floor: fl, x: b.x, z: b.z });
        if (n.floor === fl && n.x === b.x && n.z === b.z) out.push({ floor: fl, x: a.x, z: a.z });
      }
    }
  }
  for (const chute of house.chutes) {
    if (n.floor === chute.from.floor && n.x === chute.from.x && n.z === chute.from.z) {
      out.push({ floor: chute.to.floor, x: chute.to.x, z: chute.to.z });
    }
    if (n.floor === chute.to.floor && n.x === chute.to.x && n.z === chute.to.z) {
      out.push({ floor: chute.from.floor, x: chute.from.x, z: chute.from.z });
    }
  }
  return out;
}

/** Components of the walkable graph; the largest is the house, the rest islands. */
function checkConnectivity(house: House): ValidationIssue[] {
  const seen = new Set<string>();
  const components: Node[][] = [];
  for (let f = 0; f < house.grids.length; f++) {
    for (let z = 0; z < house.depth; z++) {
      for (let x = 0; x < house.width; x++) {
        if (!isWalkable(house.grids[f][z][x]) || seen.has(key(f, x, z))) continue;
        const comp: Node[] = [];
        const stack: Node[] = [{ floor: f, x, z }];
        seen.add(key(f, x, z));
        while (stack.length) {
          const cur = stack.pop()!;
          comp.push(cur);
          for (const nb of neighbours(house, cur)) {
            const k = key(nb.floor, nb.x, nb.z);
            if (seen.has(k)) continue;
            seen.add(k);
            stack.push(nb);
          }
        }
        components.push(comp);
      }
    }
  }
  if (components.length <= 1) return [];
  let mainIdx = 0;
  for (let i = 1; i < components.length; i++) {
    if (components[i].length > components[mainIdx].length) mainIdx = i;
  }
  const issues: ValidationIssue[] = [];
  components.forEach((comp, i) => {
    if (i === mainIdx) return;
    const c = comp[0];
    issues.push({
      kind: 'disconnected',
      message: `disconnected region of ${comp.length} cell(s), e.g. ${c.floor}:${c.x},${c.z}`,
      floor: c.floor,
      x: c.x,
      z: c.z,
    });
  });
  return issues;
}

/** A walkable cell open to a non-walkable neighbour through a `none` edge. */
function checkEnclosure(house: House): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (let f = 0; f < house.grids.length; f++) {
    for (let z = 0; z < house.depth; z++) {
      for (let x = 0; x < house.width; x++) {
        if (!isWalkable(house.grids[f][z][x])) continue;
        for (const [dx, dz] of ORTHO) {
          const nx = x + dx;
          const nz = z + dz;
          if (nx < 0 || nz < 0 || nx >= house.width || nz >= house.depth) continue; // envelope
          if (isWalkable(house.grids[f][nz][nx])) continue;
          if (edgeBetween(house, f, { x, z }, { x: nx, z: nz }) === 'none') {
            issues.push({
              kind: 'unenclosed',
              message: `cell ${f}:${x},${z} opens to non-walkable ${nx},${nz} with no wall`,
              floor: f,
              x,
              z,
            });
          }
        }
      }
    }
  }
  return issues;
}

/** Door/secret edges must have a walkable cell on both sides. */
function checkDoors(house: House): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (let f = 0; f < house.grids.length; f++) {
    for (let z = 0; z < house.depth; z++) {
      for (let x = 0; x < house.width; x++) {
        const v = house.edgesV[f][z][x];
        if ((v === 'door' || v === 'secret') && x < house.width - 1) {
          if (!walkable(house, f, x, z) || !walkable(house, f, x + 1, z)) {
            issues.push({
              kind: 'dangling-door',
              message: `${v} edge ${f}:${x},${z}|${x + 1},${z} has a non-walkable side`,
              floor: f,
              x,
              z,
            });
          }
        }
        const h = house.edgesH[f][z][x];
        if ((h === 'door' || h === 'secret') && z < house.depth - 1) {
          if (!walkable(house, f, x, z) || !walkable(house, f, x, z + 1)) {
            issues.push({
              kind: 'dangling-door',
              message: `${h} edge ${f}:${x},${z}|${x},${z + 1} has a non-walkable side`,
              floor: f,
              x,
              z,
            });
          }
        }
      }
    }
  }
  return issues;
}

/** Stair columns must be `stair` on both joined floors; chutes drop vertically. */
function checkAlignment(house: House): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const stair of house.stairs) {
    for (const fl of [stair.lower, stair.upper]) {
      for (const c of stair.cells) {
        if (house.grids[fl]?.[c.z]?.[c.x] !== 'stair') {
          issues.push({
            kind: 'misaligned',
            message: `stair column cell ${c.x},${c.z} is not 'stair' on floor ${fl}`,
            floor: fl,
            x: c.x,
            z: c.z,
          });
        }
      }
    }
  }
  for (const chute of house.chutes) {
    if (chute.from.x !== chute.to.x || chute.from.z !== chute.to.z) {
      issues.push({
        kind: 'misaligned',
        message: `chute ${chute.from.floor}:${chute.from.x},${chute.from.z} → ${chute.to.floor}:${chute.to.x},${chute.to.z} is not vertically aligned`,
        floor: chute.from.floor,
        x: chute.from.x,
        z: chute.from.z,
      });
    }
  }
  return issues;
}

/** Run every check; an empty result means the authored data is clean. */
export function validateMansion(house: House): ValidationIssue[] {
  return [
    ...checkConnectivity(house),
    ...checkEnclosure(house),
    ...checkDoors(house),
    ...checkAlignment(house),
  ];
}
