"use client";

import { Color } from "three";
import { Canvas } from "@react-three/fiber";
import { Avatar } from "./Avatar";
import { Participant } from "@/src/types";

export function AvatarScene({
  participant,
  // mirrored = false,
  // style,
}: {
  participant: Participant;
}) {
  return (
    <Canvas
      camera={{ fov: 25 }}
      shadows
      gl={{
        preserveDrawingBuffer: true,
        antialias: true,
        alpha: false,
      }}
      onCreated={({ gl }) => {
        // Handle WebGL context loss
        gl.domElement.addEventListener("webglcontextlost", (event) => {
          event.preventDefault();
          console.warn("WebGL context lost, attempting to restore...");
        });

        gl.domElement.addEventListener("webglcontextrestored", () => {
          console.log("WebGL context restored");
        });
      }}
    >
      <ambientLight intensity={1} />
      <pointLight
        position={[10, 10, 10]}
        color={new Color(1, 1, 0)}
        intensity={0.5}
        castShadow
      />
      <pointLight
        position={[-10, 0, 10]}
        color={new Color(1, 0, 0)}
        intensity={0.5}
        castShadow
      />
      <pointLight position={[0, 0, 10]} intensity={0.5} castShadow />
      <Avatar participant={participant} />
    </Canvas>
  );
}
