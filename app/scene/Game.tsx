"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, extend } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import { Water } from "three-stdlib";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { Ocean } from "../components/Ocean";
import { FishingBoat } from "../components/FishingBoat";
import CameraController from "../helpers/CameraControllers";

extend({ Water });

export default function Game() {
  const boatRef = useRef<THREE.Group>(null);

  return (
    <Canvas camera={{ position: [0, 5, 100], fov: 55, near: 1, far: 20000 }}>
      <ambientLight intensity={0.3} />
      <Suspense fallback={null}>
        <Environment preset="city" />
        <Sky
          distance={450000}
          sunPosition={[100, 20, 100]}
          inclination={0}
          azimuth={0.25}
          mieCoefficient={0.005}
          mieDirectionalG={0.8}
          rayleigh={1}
        />
        <Ocean />
        <FishingBoat ref={boatRef} />
        <CameraController targetRef={boatRef} />
      </Suspense>
      <Sky scale={1000} sunPosition={[500, 150, -1000]} turbidity={0.1} />
    </Canvas>
  );
}
