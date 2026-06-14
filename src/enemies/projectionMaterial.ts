import * as THREE from 'three';

/**
 * Camera-projection material: maps the reference photos (front/back/side, the
 * side mirrored for the opposite flank) onto an AI-generated mesh by surface-
 * normal direction, with a near-white → base-colour fallback for areas the
 * projection can't cover. Proven in the dev viewer; shared with the game.
 *
 * The mesh must have normals (AI meshes ship without — call computeVertexNormals
 * first) and the bounds are the mesh's local-space AABB (min/size).
 */
export interface ProjectionViews {
  front: THREE.Texture;
  back: THREE.Texture;
  side: THREE.Texture;
}

export function projectionMaterial(
  views: ProjectionViews,
  min: THREE.Vector3,
  size: THREE.Vector3,
  baseColor: number,
  opts: { roughness?: number } = {}
): THREE.MeshStandardMaterial {
  for (const t of [views.front, views.back, views.side]) t.colorSpace = THREE.SRGBColorSpace;
  const base = new THREE.Color(baseColor);
  const mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: opts.roughness ?? 0.9,
    metalness: 0,
  });
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uFront = { value: views.front };
    sh.uniforms.uBack = { value: views.back };
    sh.uniforms.uSide = { value: views.side };
    sh.uniforms.uMin = { value: min };
    sh.uniforms.uSize = { value: size };
    sh.uniforms.uBase = { value: new THREE.Vector3(base.r, base.g, base.b) };
    sh.vertexShader =
      'varying vec3 vWP; varying vec3 vWN;\n' +
      sh.vertexShader
        .replace('#include <begin_vertex>', '#include <begin_vertex>\n vWP=(modelMatrix*vec4(transformed,1.0)).xyz;')
        .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\n vWN=normalize(mat3(modelMatrix)*objectNormal);');
    sh.fragmentShader =
      'uniform sampler2D uFront; uniform sampler2D uBack; uniform sampler2D uSide; uniform vec3 uMin; uniform vec3 uSize; uniform vec3 uBase; varying vec3 vWP; varying vec3 vWN;\n' +
      // Multi-tap: dead-on (heaviest) + 4 corner-shifted samples — softens seams
      // and dilates coverage over thin gaps. White (background) taps are dropped
      // so the photo content bleeds outward instead of smearing white.
      // colourful samples win; near-white (background bleed near the silhouette)
      // is down-weighted so adjacent photo colour fills seams. Center heaviest =
      // stays sharp; only edges/gaps pull from the shifted taps.
      'float nonwhite(vec3 c){ return 1.0 - smoothstep(0.78,0.94, min(c.r,min(c.g,c.b))); }\n' +
      'vec3 tap(sampler2D t, vec2 uv){ float d=0.02;\n' +
      '  vec2 o[5]; o[0]=vec2(0.0); o[1]=vec2(d,d); o[2]=vec2(d,-d); o[3]=vec2(-d,d); o[4]=vec2(-d,-d);\n' +
      '  float bw[5]; bw[0]=3.0; bw[1]=1.0; bw[2]=1.0; bw[3]=1.0; bw[4]=1.0;\n' +
      '  vec3 acc=vec3(0.0); float ws=0.0;\n' +
      '  for(int i=0;i<5;i++){ vec3 s=texture2D(t,uv+o[i]).rgb; float w=bw[i]*(0.08+nonwhite(s)); acc+=s*w; ws+=w; }\n' +
      '  return acc/max(ws,1e-3); }\n' +
      sh.fragmentShader.replace(
        '#include <map_fragment>',
        [
          'vec3 n=normalize(vWN);',
          'float ux=(vWP.x-uMin.x)/uSize.x, uy=(vWP.y-uMin.y)/uSize.y, uz=(vWP.z-uMin.z)/uSize.z;',
          'vec3 cF=tap(uFront,vec2(ux,uy)).rgb;',
          'vec3 cB=tap(uBack,vec2(1.0-ux,uy)).rgb;',
          'vec3 cL=tap(uSide,vec2(uz,uy)).rgb;',
          'vec3 cR=tap(uSide,vec2(1.0-uz,uy)).rgb;',
          'float wF=pow(max(0.0,n.z),2.0), wB=pow(max(0.0,-n.z),2.0), wL=pow(max(0.0,-n.x),2.0), wR=pow(max(0.0,n.x),2.0);',
          'float ws=wF+wB+wL+wR+1e-3;',
          'vec3 proj=(cF*wF+cB*wB+cL*wL+cR*wR)/ws;',
          'float whiteness=smoothstep(0.82,0.97,min(proj.r,min(proj.g,proj.b)));',
          'diffuseColor.rgb*=mix(proj,uBase,whiteness);',
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
