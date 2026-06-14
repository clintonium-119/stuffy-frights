import * as THREE from 'three';

/**
 * Clean single-axis camera-projection: the FRONT photo is projected onto
 * front-facing surfaces and the BACK photo onto back-facing ones, split hard by
 * the surface normal's Z sign — so the two projections never overlap (no
 * ghosting) and there's no blur (stays sharp). Per-axis scale + offset let the
 * projection be dialled in to match the mesh; near-white (background) falls back
 * to the toy's base colour.
 *
 * The mesh needs normals (AI meshes ship without — computeVertexNormals first).
 * `min`/`size` are the mesh local-space AABB.
 */
export interface ProjectionViews {
  front: THREE.Texture;
  back: THREE.Texture;
}

export interface ProjectionTuning {
  /** UV scale about the centre (1 = bbox-fit). */
  scale?: THREE.Vector2;
  /** UV offset after scaling. */
  offset?: THREE.Vector2;
}

export function projectionMaterial(
  views: ProjectionViews,
  min: THREE.Vector3,
  size: THREE.Vector3,
  baseColor: number,
  tuning: ProjectionTuning = {},
  opts: { roughness?: number } = {}
): THREE.MeshStandardMaterial {
  for (const t of [views.front, views.back]) t.colorSpace = THREE.SRGBColorSpace;
  const base = new THREE.Color(baseColor);
  const scale = tuning.scale ?? new THREE.Vector2(1, 1);
  const offset = tuning.offset ?? new THREE.Vector2(0, 0);
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: opts.roughness ?? 0.9, metalness: 0 });
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uFront = { value: views.front };
    sh.uniforms.uBack = { value: views.back };
    sh.uniforms.uMin = { value: min };
    sh.uniforms.uSize = { value: size };
    sh.uniforms.uScale = { value: scale };
    sh.uniforms.uOffset = { value: offset };
    sh.uniforms.uBase = { value: new THREE.Vector3(base.r, base.g, base.b) };
    sh.vertexShader =
      'varying vec3 vWP; varying vec3 vWN;\n' +
      sh.vertexShader
        .replace('#include <begin_vertex>', '#include <begin_vertex>\n vWP=(modelMatrix*vec4(transformed,1.0)).xyz;')
        .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\n vWN=normalize(mat3(modelMatrix)*objectNormal);');
    sh.fragmentShader =
      'uniform sampler2D uFront; uniform sampler2D uBack; uniform vec3 uMin; uniform vec3 uSize; uniform vec2 uScale; uniform vec2 uOffset; uniform vec3 uBase; varying vec3 vWP; varying vec3 vWN;\n' +
      sh.fragmentShader.replace(
        '#include <map_fragment>',
        [
          'vec3 n=normalize(vWN);',
          'float ux=(vWP.x-uMin.x)/uSize.x, uy=(vWP.y-uMin.y)/uSize.y;',
          // scale about centre + offset
          'ux=(ux-0.5)/uScale.x+0.5+uOffset.x; uy=(uy-0.5)/uScale.y+0.5+uOffset.y;',
          'vec3 col = n.z>=0.0 ? texture2D(uFront,vec2(ux,uy)).rgb : texture2D(uBack,vec2(1.0-ux,uy)).rgb;',
          'float whiteness=smoothstep(0.82,0.97,min(col.r,min(col.g,col.b)));',
          'diffuseColor.rgb*=mix(col,uBase,whiteness);',
        ].join('\n')
      );
  };
  return mat;
}

/** Per-enemy base fallback colours (the dominant plush tone). */
export const ENEMY_BASE_COLOR: Record<string, number> = {
  poo: 0xd9b286,
  fuggie: 0x2f9e86,
  charles: 0x7ed9c4,
  newYama: 0xc69a55,
};
