import React from 'react';
import { Canvas } from '@react-three/fiber';
import { LineBasicMaterial, Vector3 } from 'three';

// Define the line geometry using Vector3 points
const points = [
  new Vector3(-1, 1, 0), new Vector3(1, 1, 0), // Top line
  new Vector3(1, 1, 0), new Vector3(1, -1, 0), // Right line
  new Vector3(1, -1, 0), new Vector3(-1, -1, 0), // Bottom line
  new Vector3(-1, -1, 0), new Vector3(-1, 1, 0), // Left line
  new Vector3(-0.5, 0.5, 0), new Vector3(0.5, 0.5, 0), // Inner top horizontal
  new Vector3(0.5, 0.5, 0), new Vector3(0.5, -0.5, 0), // Inner right vertical
  new Vector3(0.5, -0.5, 0), new Vector3(-0.5, -0.5, 0), // Inner bottom horizontal
  new Vector3(-0.5, -0.5, 0), new Vector3(-0.5, 0.5, 0)  // Inner left vertical
];

const LineComponent: React.FC = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <color attach="background" args={['black']} />
      <lineSegments>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attachObject={['attributes', 'position']}
            array={new Float32Array(points.flatMap(v => [v.x, v.y, v.z]))}
            count={points.length}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="white" />
      </lineSegments>
    </Canvas>
  );
};

export default LineComponent;