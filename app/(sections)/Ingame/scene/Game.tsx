"use client";

import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { Sky, Environment } from "@react-three/drei";
import { Water } from "three-stdlib";
import * as THREE from "three";

import { Ocean } from "../components/Ocean";
import { FishingBoat } from "../components/FishingBoat";
import CameraController from "../helpers/CameraControllers";
import GameInterface from "../components/GameInterface";
import { Trash } from "../components/Trash";
import { PlayerPresence, User } from "@/app/utils/types"
import { useRoomContext } from "@/app/context/roomContext";

extend({ Water });

type TrashItem = {
  id: number;
  position: [number, number, number];
};

function TrashManager({
  trashList,
  boatRef,
  removeTrash,
  onInit,
}: {
  trashList: TrashItem[];
  boatRef: React.RefObject<THREE.Group>;
  removeTrash: (id: number) => void;
  onInit: () => void;
}) {
  const hasSpawnedInitialTrash = useRef(false);

  useFrame(() => {
    if (!boatRef.current) return;

    const boatPos = new THREE.Vector3();
    boatRef.current.getWorldPosition(boatPos);

    // İlk çöpleri oluştur
    if (!hasSpawnedInitialTrash.current) {
      onInit(); // 5 çöp oluşturacak
      hasSpawnedInitialTrash.current = true;
    }

    // Çöp toplama kontrolü
    trashList.forEach((trash) => {
      const trashPos = new THREE.Vector3(...trash.position);
      const distance = boatPos.distanceTo(trashPos);

      if (distance < 3) {
        removeTrash(trash.id);
      }
    });
  });

  return (
    <>
      {trashList.map((trash) => (
        <Trash key={trash.id} position={trash.position} />
      ))}
    </>
  );
}

export default function Game() {
  const boatRef = useRef<THREE.Group>(null);
  const [trashList, setTrashList] = useState<TrashItem[]>([]);
    const { user, setUser} = useRoomContext()

  const addTrash = () => {
    if (boatRef.current) {
      const boatPos = boatRef.current.position;
      const offsetX = (Math.random() - 0.5) * 20;
      const offsetZ = (Math.random() - 0.5) * 20;

      const newTrash: TrashItem = {
        id: Date.now() + Math.random(),
        position: [boatPos.x + offsetX, 0, boatPos.z + offsetZ],
      };

      setTrashList((prev) => [...prev, newTrash]);
    }
  };

  const addInitialTrash = () => {
    for (let i = 0; i < 5; i++) addTrash();
  };

  const removeTrash = (id: number) => {
    setTrashList((prev) => prev.filter((trash) => trash.id !== id));
    setTimeout(() => addTrash(), 100);
    
    if (user) {
  setUser({ ...user, score: user.score + 1 })}
  console.log(user)
  };

  return (
    <>
      <GameInterface />
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
          <TrashManager
            trashList={trashList}
            boatRef={boatRef}
            removeTrash={removeTrash}
            onInit={addInitialTrash}
          />
          <FishingBoat ref={boatRef} />
          <CameraController targetRef={boatRef} />
        </Suspense>
      </Canvas>
    </>
  );
}
