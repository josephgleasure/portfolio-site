import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 4000; // Increased snow density
const AREA = 7.5;
const HEIGHT = 5.0;
const SPEED_MIN = 0.35;
const SPEED_MAX = 1.35;
const SIZE_MIN = 0.003;
const SIZE_MAX = 0.010;

const SnowParticles: React.FC = () => {
  const instancedMesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { positions, speeds, sizes } = useMemo(() => {
    const pos: THREE.Vector3[] = [];
    const spd: number[] = [];
    const sz: number[] = [];
    for (let i = 0; i < COUNT; i++) {
      pos.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * AREA,
          Math.random() * HEIGHT,
          (Math.random() - 0.5) * AREA
        )
      );
      spd.push(SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN));
      sz.push(SIZE_MIN + Math.random() * (SIZE_MAX - SIZE_MIN));
    }
    return { positions: pos, speeds: spd, sizes: sz };
  }, []);

  useFrame((state, delta) => {
    if (!instancedMesh.current) return;
    const time = state.clock.getElapsedTime();
    positions.forEach((p, i) => {
      p.y -= speeds[i] * delta;
      // subtle wind
      p.x += Math.sin(time * 0.35 + p.z) * 0.08 * delta;
      p.z += Math.cos(time * 0.22 + p.x) * 0.04 * delta;

      if (p.y < -0.35) {
        p.y = HEIGHT;
        p.x = (Math.random() - 0.5) * AREA;
        p.z = (Math.random() - 0.5) * AREA;
      }

      dummy.position.copy(p);
      dummy.scale.setScalar(sizes[i]);
      dummy.updateMatrix();
      instancedMesh.current!.setMatrixAt(i, dummy.matrix);
    });
    instancedMesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={instancedMesh} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial 
        color="#ffffff" 
        emissive="#ffffff" 
        emissiveIntensity={0.8}
        roughness={0.2}
        metalness={0.3}
        toneMapped={false}
      />
    </instancedMesh>
  );
};

export default SnowParticles;

