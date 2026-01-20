import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const PARTICLE_COUNT = 10000;
const CURVE_SEGMENTS = 64;
const THICKNESS = 2.5;
const LERP_FACTOR = 0.005; // Adjust this value to control smoothness (0-1)

// Helper function to get a point on the tube's surface
function getPointOnTube(
  curve: THREE.CatmullRomCurve3,
  t: number,
  radius: number
) {
  const position = new THREE.Vector3();
  const normal = new THREE.Vector3();
  curve.getPointAt(t, position);
  curve.getTangentAt(t, normal);
  const up = new THREE.Vector3(0, 1, 0);
  const axis = new THREE.Vector3().crossVectors(up, normal).normalize();
  const radialAngle = Math.random() * Math.PI * 2;
  const binormal = new THREE.Vector3().crossVectors(normal, axis);
  const radialVector = new THREE.Vector3()
    .addScaledVector(axis, Math.cos(radialAngle))
    .addScaledVector(binormal, Math.sin(radialAngle));
  position.add(radialVector.multiplyScalar(radius));
  return { position, normal: radialVector };
}

const Figure8Particles: React.FC = () => {
  const instancedMesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const clock = useRef(new THREE.Clock());

  const particlePositions = useMemo(
    () => new Array(PARTICLE_COUNT).fill(0).map(() => new THREE.Vector3()),
    []
  );
  const targetPositions = useMemo(
    () => new Array(PARTICLE_COUNT).fill(0).map(() => new THREE.Vector3()),
    []
  );

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      Array(CURVE_SEGMENTS)
        .fill(0)
        .map((_, i) => {
          const t = i / CURVE_SEGMENTS;
          const x = Math.sin(t * Math.PI * 2) * 2;
          const y = Math.sin(t * Math.PI * 4);
          const z = Math.cos(t * Math.PI * 2);
          return new THREE.Vector3(x, y, z);
        }),
      true
    );
  }, []);

  const radius = THICKNESS / 2;

  useFrame(() => {
    if (instancedMesh.current) {
      const time = clock.current.getElapsedTime();

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const t = (i / PARTICLE_COUNT + time * 0.1) % 1;
        const { position, normal } = getPointOnTube(curve, t, radius);

        targetPositions[i]
          .copy(position)
          .add(normal.multiplyScalar(Math.random() * radius));
        particlePositions[i].lerp(targetPositions[i], LERP_FACTOR);

        dummy.position.copy(particlePositions[i]);
        dummy.scale.setScalar(0.005);
        dummy.updateMatrix();
        instancedMesh.current.setMatrixAt(i, dummy.matrix);
      }

      instancedMesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={instancedMesh}
      args={[undefined, undefined, PARTICLE_COUNT]}
    >
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#b2b3a3" />
    </instancedMesh>
  );
};

export default Figure8Particles;
