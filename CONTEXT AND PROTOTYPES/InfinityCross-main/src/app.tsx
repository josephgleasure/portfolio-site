// App.tsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Figure8Particles from "./_Figure8Particles.tsx";
import Figure8ParticlesYellow from "./_Figure8ParticulesYellow.tsx";
import FloatingParticles from "./_FloatingParticles.tsx";
import Overlay from "./_Overlay.tsx";
import DropdownMenu from "./DropdownMenu.tsx"; // Confirm import is correct
import "./global.css";
import CrossParticles from "./CrossParticles.tsx";

const App: React.FC = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative", // Parent must be positioned relative
        overflow: "hidden",
      }}
    >
      <DropdownMenu />

      <Canvas camera={{ position: [0, 0, 2], fov: 105 }}>
        <color attach="background" args={["#121212"]} />
        <fog attach="fog" args={["#000000", 0.79, 3]} />

        <Figure8Particles />
        <Figure8ParticlesYellow />
        <CrossParticles />
        <FloatingParticles />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          minAzimuthAngle={-Infinity}
          maxAzimuthAngle={Infinity}
          rotateSpeed={0.5}
          dampingFactor={0.1}
          enableDamping={true}
        />
      </Canvas>

      <Overlay />
    </div>
  );
};

export default App;
