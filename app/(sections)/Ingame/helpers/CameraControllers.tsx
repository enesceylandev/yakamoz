"use client";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

export default function CameraController({
  targetRef,
}: {
  targetRef: React.RefObject<THREE.Group | null>;
}) {
  const { camera } = useThree();

  const currentCameraPosition = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!targetRef.current) return;

    const target = targetRef.current;

    // Hedef pozisyon ve yön
    const targetPosition = target.position.clone();
    const rotationY = target.rotation.y;

    // Dinamik offset: ileri/geri hareketlerde öne/arkaya hafif kayma
    const forward = new THREE.Vector3(
      Math.sin(rotationY),
      0,
      Math.cos(rotationY),
    );
    const side = new THREE.Vector3().crossVectors(
      forward,
      new THREE.Vector3(0, 1, 0),
    );

    // Kamerayı ileri giderken biraz geriye, geri giderken biraz öne kaydırmak için varsayılan offset + z eksenine bağlı modifikasyon
    const dynamicOffset = new THREE.Vector3()
      .copy(forward)
      .multiplyScalar(-12)
      .add(side.multiplyScalar(1.5))
      .add(new THREE.Vector3(0, 3.5, 0));

    // Hedef kamera pozisyonu
    const desiredCameraPos = targetPosition.clone().add(dynamicOffset);

    // Akıcı geçiş için linear interpolation (lerp)
    currentCameraPosition.current.lerp(desiredCameraPos, 0.05);
    currentLookAt.current.lerp(targetPosition, 0.05);

    // Kameraya uygula
    camera.position.copy(currentCameraPosition.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
