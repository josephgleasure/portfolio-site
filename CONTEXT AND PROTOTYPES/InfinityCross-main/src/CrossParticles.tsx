import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 5000;
const THICKNESS = 0.2;
const ARM_LENGTH = 2;
const SPEED = 11.35;
const PARTICLE_SIZE = 0.005; // Significantly reduced particle size

const CrossParticles: React.FC = () => {
  const instancedMesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { positions, velocities } = useMemo(() => {
    const pos: THREE.Vector3[] = [];
    const vels: THREE.Vector3[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      let x,
        y,
        z,
        vx = 0,
        vy = 0,
        vz = 0;
      if (Math.random() < 0.5) {
        // Horizontal arm
        x = (Math.random() - 0.5) * ARM_LENGTH;
        y = (Math.random() - 0.5) * THICKNESS;
        z = (Math.random() - 0.5) * THICKNESS;
        vx = (Math.random() - 0.5) * SPEED;
      } else {
        // Vertical arm
        x = (Math.random() - 0.5) * THICKNESS;
        y = (Math.random() - 0.5) * ARM_LENGTH;
        z = (Math.random() - 0.5) * THICKNESS;
        vy = (Math.random() - 0.5) * SPEED;
      }
      pos.push(new THREE.Vector3(x, y, z));
      vels.push(new THREE.Vector3(vx, vy, vz));
    }
    return { positions: pos, velocities: vels };
  }, []);

  useFrame((state, delta) => {
    if (instancedMesh.current) {
      positions.forEach((pos, i) => {
        const vel = velocities[i];

        // Update position
        pos.add(vel.clone().multiplyScalar(delta));

        // Bounce off the edges
        if (Math.abs(pos.x) > ARM_LENGTH / 2) {
          vel.x *= -1;
          pos.x = (Math.sign(pos.x) * ARM_LENGTH) / 2;
        }
        if (Math.abs(pos.y) > ARM_LENGTH / 2) {
          vel.y *= -1;
          pos.y = (Math.sign(pos.y) * ARM_LENGTH) / 2;
        }

        dummy.position.copy(pos);
        dummy.scale.setScalar(PARTICLE_SIZE);
        dummy.updateMatrix();
        instancedMesh.current.setMatrixAt(i, dummy.matrix);
      });

      instancedMesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={instancedMesh}
      args={[undefined, undefined, PARTICLE_COUNT]}
    >
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#F6f1ff" />
    </instancedMesh>
  );
};

export default CrossParticles;
