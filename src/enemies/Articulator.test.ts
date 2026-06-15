import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { Articulator, ArticulatorBones, ArticulationFrame } from './Articulator';

const DT = 1 / 60;

function frame(over: Partial<ArticulationFrame> = {}): ArticulationFrame {
  return {
    dt: DT,
    moving: false,
    gaitT: 0,
    lookTarget: null,
    lookIntensity: 0,
    position: new THREE.Vector3(),
    floorIndex: 0,
    floorHeightAt: null,
    ...over,
  };
}

function make(bones: ArticulatorBones, gait: 'hop' | 'shuffle' | 'trot' | 'haul' = 'trot', h = 1, beat?: (k: string) => void) {
  const root = new THREE.Object3D();
  const anim = new THREE.Object3D();
  return { art: new Articulator(bones, root, anim, gait, h, beat), root, anim };
}

describe('Articulator head gaze', () => {
  it('eases the head toward a look-down pitch, clamped to the cone', () => {
    const head = new THREE.Object3D();
    const { art } = make({ head });
    // Target directly below the head → maximal look-down, clamped to 0.7.
    for (let i = 0; i < 120; i++) {
      art.pose(frame({ lookTarget: new THREE.Vector3(0, -5, 0), lookIntensity: 1 }));
    }
    expect(head.rotation.x).toBeCloseTo(0.7, 2);
    expect(head.rotation.y).toBeCloseTo(0, 2);
  });

  it('clamps a hard side-look yaw to the cone', () => {
    const head = new THREE.Object3D();
    const { art } = make({ head });
    for (let i = 0; i < 120; i++) {
      art.pose(frame({ lookTarget: new THREE.Vector3(50, 0, 0), lookIntensity: 1 }));
    }
    expect(head.rotation.y).toBeCloseTo(0.7, 2);
  });

  it('scales the gaze by intensity', () => {
    const head = new THREE.Object3D();
    const { art } = make({ head });
    for (let i = 0; i < 120; i++) {
      art.pose(frame({ lookTarget: new THREE.Vector3(0, -5, 0), lookIntensity: 0.5 }));
    }
    expect(head.rotation.x).toBeCloseTo(0.35, 2);
  });
});

describe('Articulator leg swing', () => {
  it('swings a quadruped in diagonal pairs (FL+HR vs FR+HL)', () => {
    const legs = [new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D()];
    const { art } = make({ legs });
    art.pose(frame({ moving: true, gaitT: (Math.PI / 2) / 2.6 }));
    // FL (0) and HR (3) in phase; FR (1) and HL (2) a half-cycle behind.
    expect(legs[0].rotation.x).toBeCloseTo(legs[3].rotation.x, 5);
    expect(legs[1].rotation.x).toBeCloseTo(legs[2].rotation.x, 5);
    expect(legs[0].rotation.x).toBeCloseTo(-legs[1].rotation.x, 5);
    expect(Math.abs(legs[0].rotation.x)).toBeCloseTo(0.45, 5); // sin(π/2)*0.45
  });

  it('alternates a biped and eases legs to rest when stopped', () => {
    const legs = [new THREE.Object3D(), new THREE.Object3D()];
    const { art } = make({ legs });
    art.pose(frame({ moving: true, gaitT: (Math.PI / 2) / 2.6 }));
    expect(legs[0].rotation.x).toBeCloseTo(-legs[1].rotation.x, 5);
    for (let i = 0; i < 200; i++) art.pose(frame({ moving: false }));
    expect(legs[0].rotation.x).toBeCloseTo(0, 3);
  });
});

describe('Articulator arm swing', () => {
  it('swings arms in opposition while moving and eases to rest', () => {
    const arms = [new THREE.Object3D(), new THREE.Object3D()];
    const { art } = make({ arms });
    art.pose(frame({ moving: true, gaitT: (Math.PI / 2) / 2.6 }));
    expect(arms[0].rotation.y).toBeCloseTo(0.5, 5); // sin(π/2)*0.5
    expect(arms[1].rotation.y).toBeCloseTo(-0.5, 5);
    for (let i = 0; i < 200; i++) art.pose(frame({ moving: false }));
    expect(arms[0].rotation.y).toBeCloseTo(0, 3);
  });
});

describe('Articulator body locomotion', () => {
  it('hop bounces and squash-stretches volume-preservingly', () => {
    const { art, anim } = make({}, 'hop', 1);
    art.pose(frame({ moving: true, gaitT: (Math.PI / 2) / 3.2 })); // apex
    expect(anim.position.y).toBeCloseTo(0.18, 5);
    expect(anim.scale.y).toBeCloseTo(1.14, 5);
    expect(anim.scale.x).toBeCloseTo(1 / Math.sqrt(1.14), 5);
  });

  it('hop emits a fwump beat at the bottom of the bounce', () => {
    const beats: string[] = [];
    const { art } = make({}, 'hop', 1, (k) => beats.push(k));
    art.pose(frame({ moving: true, gaitT: Math.PI / 3.2 })); // sin(π)=0 → grounded
    expect(beats).toContain('fwump');
  });

  it('eases the body back to neutral when idle', () => {
    const { art, anim } = make({}, 'hop', 1);
    art.pose(frame({ moving: true, gaitT: (Math.PI / 2) / 3.2 }));
    for (let i = 0; i < 300; i++) art.pose(frame({ moving: false }));
    expect(anim.position.y).toBeCloseTo(0, 3);
    expect(anim.scale.y).toBeCloseTo(1, 3);
  });
});

describe('Articulator stair foot placement', () => {
  it('tips the body nose-up when front feet are on higher ground', () => {
    const legs = [new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D()];
    legs[0].position.set(-0.3, 0, 0.3); // front-left
    legs[1].position.set(0.3, 0, 0.3); // front-right
    legs[2].position.set(-0.3, 0, -0.3); // hind-left
    legs[3].position.set(0.3, 0, -0.3); // hind-right
    const { art, root } = make({ legs });
    // Floor rises toward +Z (front higher than the body centre / hind feet).
    const floorHeightAt = (_x: number, z: number) => Math.max(0, z) * 0.5;
    for (let i = 0; i < 200; i++) {
      art.pose(frame({ floorHeightAt, position: new THREE.Vector3(0, 0, 0) }));
    }
    // Ascending → nose tips up → negative rotation.x (per bodyPitchFromFeet sign).
    expect(root.rotation.x).toBeLessThan(0);
  });
});
