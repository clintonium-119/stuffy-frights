import * as THREE from 'three';
import { EnemyProjection } from './projectionConfig';

/**
 * Camera-projection material. The SIDE photo is the base layer (mirrored for the
 * opposite flank); FRONT and BACK are layered on top, prioritised where the
 * surface faces forward/back — single-tap (sharp, no ghosting). Each view has an
 * independent UV transform (scale/offset/rot) from the stored config, so each
 * model's projections are dialled in independently and reproducibly. Areas the
 * projection can't cover fall back to the toy's average colour (not white).
 *
 * The mesh needs normals (AI meshes ship without — computeVertexNormals first).
 * `min`/`size` are the mesh local-space AABB. The live uniforms are stashed on
 * `material.userData.proj` so the viewer can tune them.
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
  cfg: EnemyProjection,
  opts: { roughness?: number } = {}
): THREE.MeshStandardMaterial {
  for (const t of [views.front, views.back, views.side]) t.colorSpace = THREE.SRGBColorSpace;
  const base = new THREE.Color(cfg.base);
  const v2 = (a: [number, number]) => new THREE.Vector2(a[0], a[1]);
  const u = {
    uFront: { value: views.front },
    uBack: { value: views.back },
    uSide: { value: views.side },
    uMin: { value: min },
    uSize: { value: size },
    uBase: { value: new THREE.Vector3(base.r, base.g, base.b) },
    uFrontS: { value: v2(cfg.front.scale) },
    uFrontO: { value: v2(cfg.front.offset) },
    uFrontR: { value: cfg.front.rot },
    uBackS: { value: v2(cfg.back.scale) },
    uBackO: { value: v2(cfg.back.offset) },
    uBackR: { value: cfg.back.rot },
    uSideS: { value: v2(cfg.side.scale) },
    uSideO: { value: v2(cfg.side.offset) },
    uSideR: { value: cfg.side.rot },
  };
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: opts.roughness ?? 0.9, metalness: 0 });
  mat.userData.proj = u;
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u);
    sh.vertexShader =
      'varying vec3 vWP; varying vec3 vWN;\n' +
      sh.vertexShader
        .replace('#include <begin_vertex>', '#include <begin_vertex>\n vWP=(modelMatrix*vec4(transformed,1.0)).xyz;')
        .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\n vWN=normalize(mat3(modelMatrix)*objectNormal);');
    sh.fragmentShader =
      [
        'uniform sampler2D uFront; uniform sampler2D uBack; uniform sampler2D uSide;',
        'uniform vec3 uMin; uniform vec3 uSize; uniform vec3 uBase;',
        'uniform vec2 uFrontS; uniform vec2 uFrontO; uniform float uFrontR;',
        'uniform vec2 uBackS; uniform vec2 uBackO; uniform float uBackR;',
        'uniform vec2 uSideS; uniform vec2 uSideO; uniform float uSideR;',
        'varying vec3 vWP; varying vec3 vWN;',
        // scale (zoom about centre) + rotate + offset
        'vec2 xform(vec2 uv, vec2 s, vec2 o, float r){ vec2 p=uv-0.5; float c=cos(r),sn=sin(r); p=vec2(p.x*c-p.y*sn, p.x*sn+p.y*c); return p/s+0.5+o; }',
        '',
      ].join('\n') +
      sh.fragmentShader.replace(
        '#include <map_fragment>',
        [
          'vec3 n=normalize(vWN);',
          'float ux=(vWP.x-uMin.x)/uSize.x, uy=(vWP.y-uMin.y)/uSize.y, uz=(vWP.z-uMin.z)/uSize.z;',
          'vec2 fuv=xform(vec2(ux,uy), uFrontS,uFrontO,uFrontR);',
          'vec2 buv=xform(vec2(1.0-ux,uy), uBackS,uBackO,uBackR);',
          'vec2 sLuv=xform(vec2(uz,uy), uSideS,uSideO,uSideR);',
          'vec2 sRuv=xform(vec2(1.0-uz,uy), uSideS,uSideO,uSideR);',
          'vec3 col = n.x<0.0 ? texture2D(uSide,sLuv).rgb : texture2D(uSide,sRuv).rgb;',
          'float wf=smoothstep(0.25,0.6,n.z), wb=smoothstep(0.25,0.6,-n.z);',
          'col = mix(col, texture2D(uFront,fuv).rgb, wf);',
          'col = mix(col, texture2D(uBack,buv).rgb, wb);',
          'float whiteness=smoothstep(0.82,0.97,min(col.r,min(col.g,col.b)));',
          'diffuseColor.rgb*=mix(col,uBase,whiteness);',
        ].join('\n')
      );
  };
  return mat;
}
