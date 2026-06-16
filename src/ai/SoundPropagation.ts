import * as THREE from 'three';
import { CellKind, House, cellToWorld } from '../world/layoutTypes';
import { NavNodeId } from './NavGraph';

/** Result of a pathed-hearing query from a listener to a sound source. */
export interface SoundResult {
  /** Whether the sound reaches the listener within the attenuation budget. */
  audible: boolean;
  /** Loudness at the listener [0..1], falling off with travelled path cost. */
  intensity: number;
  /** World-space XZ direction the sound arrives from (first path step), or null. */
  arrivalDir: THREE.Vector3 | null;
}

/** Tuning for a propagation query, in path-cost units (≈ cells travelled). */
export interface SoundParams {
  /** Attenuation budget: beyond this travelled cost the sound is inaudible. */
  maxCost: number;
  /** Extra cost added when the path passes through a door cell. */
  doorCost: number;
}

/** Minimal graph surface the propagation needs (NavGraph satisfies it). */
export interface SoundGraph {
  nearestNode(worldPos: THREE.Vector3): NavNodeId | null;
  soundNeighbors(node: NavNodeId): { to: NavNodeId; cost: number }[];
}

const cellKey = (n: NavNodeId): string => `${n.floor}:${n.x},${n.z}`;
const INAUDIBLE: SoundResult = { audible: false, intensity: 0, arrivalDir: null };

function doorPenalty(house: House, n: NavNodeId, doorCost: number): number {
  const kind: CellKind | undefined = house.grids[n.floor]?.[n.z]?.[n.x];
  return kind === 'door' ? doorCost : 0;
}

/**
 * How loudly (if at all) a sound emitted at `sourceWorld` reaches a listener at
 * `listenerWorld`, travelling through navigable space. A Dijkstra expands from
 * the listener over walkable cells: walls aren't nodes so the search routes
 * around them (occlusion via detour length), doors add `doorCost`, and the
 * shortest travelled cost sets the intensity (`1 - cost/maxCost`). `arrivalDir`
 * is the world direction of the first step toward the source — the corner the
 * sound rounds, not a straight line through the wall. Deterministic; pure.
 */
export function propagateSound(
  graph: SoundGraph,
  house: House,
  listenerWorld: THREE.Vector3,
  sourceWorld: THREE.Vector3,
  params: SoundParams
): SoundResult {
  const start = graph.nearestNode(listenerWorld);
  const goal = graph.nearestNode(sourceWorld);
  if (!start || !goal) return INAUDIBLE;
  const startKey = cellKey(start);
  const goalKey = cellKey(goal);
  if (startKey === goalKey) return { audible: true, intensity: 1, arrivalDir: null };

  // Dijkstra from the listener; small grids, so a linear-scan frontier is fine.
  const dist = new Map<string, number>([[startKey, 0]]);
  const prev = new Map<string, NavNodeId>();
  const nodeOf = new Map<string, NavNodeId>([[startKey, start]]);
  const frontier = new Map<string, number>([[startKey, 0]]);
  const settled = new Set<string>();

  while (frontier.size) {
    let curKey = '';
    let best = Infinity;
    for (const [k, d] of frontier) {
      if (d < best) {
        best = d;
        curKey = k;
      }
    }
    frontier.delete(curKey);
    if (settled.has(curKey)) continue;
    settled.add(curKey);
    if (curKey === goalKey) break;
    if (best >= params.maxCost) break; // nothing else can land within budget

    const cur = nodeOf.get(curKey)!;
    for (const { to, cost } of graph.soundNeighbors(cur)) {
      const tKey = cellKey(to);
      if (settled.has(tKey)) continue;
      const nd = best + cost + doorPenalty(house, to, params.doorCost);
      if (nd < (dist.get(tKey) ?? Infinity)) {
        dist.set(tKey, nd);
        prev.set(tKey, cur);
        nodeOf.set(tKey, to);
        frontier.set(tKey, nd);
      }
    }
  }

  const total = dist.get(goalKey);
  if (total === undefined || total > params.maxCost) return INAUDIBLE;

  // Walk back from the goal to find the first step away from the listener.
  let firstStep: NavNodeId = goal;
  let cursor: string | undefined = goalKey;
  while (cursor && cursor !== startKey) {
    const node = nodeOf.get(cursor);
    if (node) firstStep = node;
    const p = prev.get(cursor);
    cursor = p ? cellKey(p) : undefined;
  }

  const sw = cellToWorld(firstStep.x, firstStep.z);
  const arrivalDir = new THREE.Vector3(sw.x - listenerWorld.x, 0, sw.z - listenerWorld.z);
  if (arrivalDir.lengthSq() > 1e-9) arrivalDir.normalize();
  else arrivalDir.set(0, 0, 0);
  return { audible: true, intensity: Math.max(0, 1 - total / params.maxCost), arrivalDir };
}
