import * as THREE from 'three';
import { Rng } from '../core/rng';
import { NavNodeId } from './NavGraph';

/** A patrol destination under consideration, with its last-visit time. */
export interface PatrolCandidate {
  node: NavNodeId;
  world: THREE.Vector3;
  /** Sim time the enemy last visited this node; -Infinity if never. */
  lastVisitAt: number;
}

/** Tunable weights + shape for patrol-target scoring (from config.ai). */
export interface PatrolWeights {
  /** Weight on revisiting long-unvisited nodes. */
  recency: number;
  /** Weight on exploring farther nodes. */
  curiosity: number;
  /** Weight on the seeded random tie-break. */
  jitter: number;
  /** Seconds for a node's recency score to recover to 1 after a visit. */
  recencyFull: number;
  /** Metres at which the distance term saturates to 1. */
  distanceRef: number;
  /** Weighted-random selection pool size (never strict argmax). */
  topN: number;
}

/**
 * Utility of one patrol candidate. Higher = a more appealing place to wander
 * next: long-unvisited (recency recovers toward 1 over `recencyFull`), farther
 * away (curiosity, saturating at `distanceRef`), plus a caller-supplied jitter
 * roll [0..1) so equal nodes break ties differently each pick. Pure.
 */
export function scorePatrolCandidate(
  c: PatrolCandidate,
  fromWorld: THREE.Vector3,
  now: number,
  w: PatrolWeights,
  jitterRoll: number
): number {
  const sinceVisit = now - c.lastVisitAt; // Infinity when never visited
  const recency = Number.isFinite(sinceVisit) ? Math.min(1, Math.max(0, sinceVisit) / w.recencyFull) : 1;
  const dist = Math.hypot(c.world.x - fromWorld.x, c.world.z - fromWorld.z);
  const distance = Math.min(1, dist / w.distanceRef);
  return w.recency * recency + w.curiosity * distance + w.jitter * jitterRoll;
}

/**
 * Pick a patrol target by scoring every candidate then drawing weighted-random
 * from the top-N (so it reads as deliberate-but-varied, not greedy argmax and
 * not pure random). Deterministic for a fixed `rng` seed. Returns null only for
 * an empty candidate list.
 */
export function selectPatrolTarget(
  candidates: PatrolCandidate[],
  fromWorld: THREE.Vector3,
  now: number,
  w: PatrolWeights,
  rng: Rng
): PatrolCandidate | null {
  if (candidates.length === 0) return null;
  const scored = candidates.map((c) => ({
    c,
    score: scorePatrolCandidate(c, fromWorld, now, w, rng.next()),
  }));
  scored.sort((a, b) => b.score - a.score);
  const pool = scored.slice(0, Math.max(1, Math.min(Math.floor(w.topN), scored.length)));
  const total = pool.reduce((s, e) => s + Math.max(0, e.score), 0);
  if (total <= 0) return pool[0].c;
  let r = rng.next() * total;
  for (const e of pool) {
    r -= Math.max(0, e.score);
    if (r <= 0) return e.c;
  }
  return pool[pool.length - 1].c;
}

/**
 * Double-take predicate: a new target switch is worth it only when it beats the
 * current target's utility by more than `margin` (prevents jittery indecision;
 * a clearly-worse alternative never triggers a switch).
 */
export function overtakes(candidateScore: number, currentScore: number, margin: number): boolean {
  return candidateScore > currentScore + margin;
}

/**
 * Best candidate by un-jittered utility, for the double-take check (a stable
 * comparison the random selection can't give). Returns null for an empty list.
 */
export function bestPatrolCandidate(
  candidates: PatrolCandidate[],
  fromWorld: THREE.Vector3,
  now: number,
  w: PatrolWeights
): { candidate: PatrolCandidate; score: number } | null {
  let best: PatrolCandidate | null = null;
  let bestScore = -Infinity;
  for (const c of candidates) {
    const s = scorePatrolCandidate(c, fromWorld, now, w, 0);
    if (s > bestScore) {
      bestScore = s;
      best = c;
    }
  }
  return best ? { candidate: best, score: bestScore } : null;
}
