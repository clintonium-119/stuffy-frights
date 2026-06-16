import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { Rng } from '../core/rng';
import { NavNodeId } from './NavGraph';
import {
  PatrolCandidate,
  PatrolWeights,
  scorePatrolCandidate,
  selectPatrolTarget,
  bestPatrolCandidate,
  overtakes,
} from './PatrolUtility';

const W: PatrolWeights = {
  recency: 1,
  curiosity: 0.6,
  jitter: 0.3,
  recencyFull: 25,
  distanceRef: 12,
  topN: 4,
};

const node = (x: number, z: number): NavNodeId => ({ floor: 0, x, z });
const cand = (x: number, z: number, lastVisitAt: number): PatrolCandidate => ({
  node: node(x, z),
  world: new THREE.Vector3(x, 0, z),
  lastVisitAt,
});
const origin = new THREE.Vector3(0, 0, 0);

describe('PatrolUtility', () => {
  it('a recently-visited node scores lower than an identical long-unvisited one', () => {
    const recent = cand(5, 0, 9); // visited 1s ago (now = 10)
    const stale = cand(5, 0, -100); // visited long ago
    const sRecent = scorePatrolCandidate(recent, origin, 10, W, 0);
    const sStale = scorePatrolCandidate(stale, origin, 10, W, 0);
    expect(sRecent).toBeLessThan(sStale);
  });

  it('recency recovers toward full as time since the visit grows', () => {
    const c = cand(5, 0, 0);
    const early = scorePatrolCandidate(c, origin, 2, W, 0);
    const later = scorePatrolCandidate(c, origin, 20, W, 0);
    expect(later).toBeGreaterThan(early);
  });

  it('farther nodes get a curiosity bonus', () => {
    const near = scorePatrolCandidate(cand(2, 0, -100), origin, 10, W, 0);
    const far = scorePatrolCandidate(cand(11, 0, -100), origin, 10, W, 0);
    expect(far).toBeGreaterThan(near);
  });

  it('selection is deterministic for a fixed seed', () => {
    const cands = [cand(2, 0, 0), cand(8, 0, -50), cand(11, 0, -100), cand(4, 0, 5)];
    const a = selectPatrolTarget(cands, origin, 10, W, new Rng(7));
    const b = selectPatrolTarget(cands, origin, 10, W, new Rng(7));
    expect(a?.node).toEqual(b?.node);
  });

  it('is weighted-random over the top-N, not strict argmax', () => {
    const cands = [cand(2, 0, 0), cand(8, 0, -50), cand(11, 0, -100), cand(4, 0, 5), cand(9, 0, -30)];
    const argmax = bestPatrolCandidate(cands, origin, 10, W)!.candidate.node;
    const picks = new Set<string>();
    for (let seed = 0; seed < 40; seed++) {
      const p = selectPatrolTarget(cands, origin, 10, W, new Rng(seed))!;
      picks.add(`${p.node.x},${p.node.z}`);
    }
    // Over many seeds it picks more than just the single best node.
    expect(picks.size).toBeGreaterThan(1);
    // ...and at least sometimes picks something other than the argmax.
    expect([...picks].some((k) => k !== `${argmax.x},${argmax.z}`)).toBe(true);
  });

  it('overtakes: only a clearly-better target (beyond margin) triggers a switch', () => {
    expect(overtakes(1.5, 1.0, 0.35)).toBe(true); // beats by 0.5 > margin
    expect(overtakes(1.2, 1.0, 0.35)).toBe(false); // beats by only 0.2 < margin
    expect(overtakes(0.5, 1.0, 0.35)).toBe(false); // clearly worse → never
    expect(overtakes(1.0, 1.0, 0.35)).toBe(false); // equal → never
  });

  it('bestPatrolCandidate ignores jitter (stable utility for the double-take check)', () => {
    const cands = [cand(2, 0, 0), cand(11, 0, -100)];
    const a = bestPatrolCandidate(cands, origin, 10, W)!;
    const b = bestPatrolCandidate(cands, origin, 10, W)!;
    expect(a.candidate.node).toEqual(b.candidate.node);
    expect(a.score).toBe(b.score);
  });
});
