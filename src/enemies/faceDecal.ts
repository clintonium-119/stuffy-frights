import * as THREE from 'three';

/**
 * A face-decal geometry that wraps onto a head instead of floating flat: a
 * `CircleGeometry` whose vertices are pushed onto the surface of a sphere of
 * `headRadius`, so a painted (planar-UV) face texture conforms to the head's
 * curve. Returned as a CircleGeometry instance, preserving the planar UVs the
 * face painters assume (and the orientation contract the enemy tests check).
 *
 * The decal's local +Z points out of the head; mount it just proud of the head
 * surface at the face position.
 */
export function faceDecal(radius: number, headRadius: number, segments = 48): THREE.CircleGeometry {
  const g = new THREE.CircleGeometry(radius, segments);
  const pos = g.attributes.position;
  const R = Math.max(headRadius, radius * 1.02);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = Math.sqrt(Math.max(0, R * R - x * x - y * y)) - R;
    pos.setZ(i, z);
  }
  pos.needsUpdate = true;
  g.computeVertexNormals();
  return g;
}
