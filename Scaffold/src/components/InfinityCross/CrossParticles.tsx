import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// WIREFRAME OUTLINE + ATMOSPHERIC GLOW (bloom handled by post-processing)

const THICKNESS = 0.28;
const ARM_LENGTH = 2.6;
const DEPTH = 0.18;
const GLOW_PARTICLES = 2000; // Soft particle fill

const CrossParticles: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  const glowMeshRef = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Wireframe outline geometry
  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    
    const hw = THICKNESS / 2;
    const hl = ARM_LENGTH / 2;
    const hd = DEPTH / 2;
    
    const addEdge = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) => {
      points.push(new THREE.Vector3(x1, y1, z1));
      points.push(new THREE.Vector3(x2, y2, z2));
    };
    
    // HORIZONTAL ARM
    addEdge(-hl, -hw, hd, hl, -hw, hd);
    addEdge(-hl, hw, hd, hl, hw, hd);
    addEdge(-hl, -hw, hd, -hl, hw, hd);
    addEdge(hl, -hw, hd, hl, hw, hd);
    addEdge(-hl, -hw, -hd, hl, -hw, -hd);
    addEdge(-hl, hw, -hd, hl, hw, -hd);
    addEdge(-hl, -hw, -hd, -hl, hw, -hd);
    addEdge(hl, -hw, -hd, hl, hw, -hd);
    addEdge(-hl, -hw, hd, -hl, -hw, -hd);
    addEdge(-hl, hw, hd, -hl, hw, -hd);
    addEdge(hl, -hw, hd, hl, -hw, -hd);
    addEdge(hl, hw, hd, hl, hw, -hd);
    
    // VERTICAL ARM
    addEdge(-hw, -hl, hd, hw, -hl, hd);
    addEdge(-hw, hl, hd, hw, hl, hd);
    addEdge(-hw, -hl, hd, -hw, hl, hd);
    addEdge(hw, -hl, hd, hw, hl, hd);
    addEdge(-hw, -hl, -hd, hw, -hl, -hd);
    addEdge(-hw, hl, -hd, hw, hl, -hd);
    addEdge(-hw, -hl, -hd, -hw, hl, -hd);
    addEdge(hw, -hl, -hd, hw, hl, -hd);
    addEdge(-hw, -hl, hd, -hw, -hl, -hd);
    addEdge(-hw, hl, hd, -hw, hl, -hd);
    addEdge(hw, -hl, hd, hw, -hl, -hd);
    addEdge(hw, hl, hd, hw, hl, -hd);
    
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  // Atmospheric glow particles filling the cross volume
  const { glowPositions, glowScales } = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const scales: number[] = [];
    
    for (let i = 0; i < GLOW_PARTICLES; i++) {
      if (Math.random() < 0.5) {
        // Horizontal arm - concentrated toward center
        const x = (Math.random() - 0.5) * ARM_LENGTH;
        const y = (Math.random() - 0.5) * THICKNESS * 1.4;
        const z = (Math.random() - 0.5) * DEPTH * 1.4;
        positions.push(new THREE.Vector3(x, y, z));
      } else {
        // Vertical arm
        const x = (Math.random() - 0.5) * THICKNESS * 1.4;
        const y = (Math.random() - 0.5) * ARM_LENGTH;
        const z = (Math.random() - 0.5) * DEPTH * 1.4;
        positions.push(new THREE.Vector3(x, y, z));
      }
      
      // Varying sizes for soft diffusion
      scales.push(0.02 + Math.random() * 0.04);
    }
    
    return { glowPositions: positions, glowScales: scales };
  }, []);

  // Animate wireframe pulse and glow particles drift
  useFrame(({ clock }) => {
    if (!groupRef.current || !materialRef.current || !glowMeshRef.current) return;
    
    const t = clock.getElapsedTime();
    
    // Wireframe pulse
    const pulse = 0.2 + Math.sin(t * 1.0) * 0.3;
    materialRef.current.opacity = pulse;
    
    // Update glow particles with subtle drift
    glowPositions.forEach((p, i) => {
      dummy.position.copy(p);
      dummy.position.x += Math.sin(t * 0.5 + i * 0.1) * 0.003;
      dummy.position.y += Math.cos(t * 0.4 + i * 0.15) * 0.003;
      dummy.scale.setScalar(glowScales[i]);
      dummy.updateMatrix();
      glowMeshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    glowMeshRef.current.instanceMatrix.needsUpdate = true;
    
    // Subtle floating
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.08;
    groupRef.current.rotation.y = t * 0.05;
  });

  return (
    <group ref={groupRef}>
      {/* Point lights to make cross glow - 100% more intense */}
      <pointLight position={[0, 0, 0]} color="#ffffff" intensity={5.0} distance={7} />
      <pointLight position={[0, ARM_LENGTH / 4, 0]} color="#ffffff" intensity={3.6} distance={6} />
      <pointLight position={[ARM_LENGTH / 4, 0, 0]} color="#ffffff" intensity={3.6} distance={6} />
      <pointLight position={[-ARM_LENGTH / 4, 0, 0]} color="#ffffff" intensity={3.6} distance={6} />
      
      {/* Sharp wireframe outline */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial 
          ref={materialRef}
          color="#ffffff" 
          linewidth={3}
          toneMapped={false}
          transparent
          opacity={1.0}
        />
      </lineSegments>
    </group>
  );
};

export default CrossParticles;
