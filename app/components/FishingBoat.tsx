"use client";

/*
Author: Vasanth adepu (https://sketchfab.com/vasanthadepu)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/fishing-boat-1e0371ad73e14e29a13464a54105e80a
Title: fishing boat
*/

import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { GLTF } from "three/examples/jsm/Addons.js";

type GLTFResult = GLTF & {
  nodes: {
    polySurface202_aiStandardSurface1_0: THREE.Mesh;
    polySurface202_aiStandardSurface1_0_1: THREE.Mesh;
    polySurface202_aiStandardSurface2_0: THREE.Mesh;
    polySurface202_aiStandardSurface2_0_1: THREE.Mesh;
    polySurface202_aiStandardSurface3_0: THREE.Mesh;
    polySurface202_aiStandardSurface3_0_1: THREE.Mesh;
    polySurface202_aiStandardSurface3_0_2: THREE.Mesh;
    polySurface202_aiStandardSurface3_0_3: THREE.Mesh;
    polySurface202_aiStandardSurface4_0: THREE.Mesh;
    polySurface202_aiStandardSurface4_0_1: THREE.Mesh;
    polySurface202_aiStandardSurface4_0_2: THREE.Mesh;
  };
  materials: {
    aiStandardSurface1: THREE.Material;
    aiStandardSurface2: THREE.Material;
    aiStandardSurface3: THREE.Material;
    aiStandardSurface4: THREE.Material;
  };
};

export const FishingBoat = forwardRef<THREE.Group>((props, ref) => {
  FishingBoat.displayName = "FishingBoat";
  const group = useRef<THREE.Group>(null);
  const velocity = useRef(0);
  const maxSpeed = 0.03;
  const acceleration = 0.001;
  const deceleration = 0.0005;
  const turnSpeed = 0.003;

  const { nodes, materials } = useGLTF(
    "/models/fishing_boat.glb",
  ) as unknown as GLTFResult;

  const [keysPressed, setKeysPressed] = useState<{ [key: string]: boolean }>(
    {},
  );

  useImperativeHandle(ref, () => group.current!);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) =>
      setKeysPressed((prev) => ({ ...prev, [e.key.toLowerCase()]: true }));
    const handleKeyUp = (e: KeyboardEvent) =>
      setKeysPressed((prev) => ({ ...prev, [e.key.toLowerCase()]: false }));

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame((state) => {
    const boat = group.current;
    if (!boat) return;

    boat.position.y = Math.sin(state.clock.elapsedTime * 5) * 0.05;
    boat.rotation.x = Math.sin(state.clock.elapsedTime * 3) * 0.05;
    boat.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.05;

    if (keysPressed["a"]) {
      boat.rotation.y += turnSpeed;
    }
    if (keysPressed["d"]) boat.rotation.y -= turnSpeed;

    if (keysPressed["w"]) {
      velocity.current = Math.min(velocity.current + acceleration, maxSpeed);
    } else if (keysPressed["s"]) {
      velocity.current = Math.max(velocity.current - acceleration, -maxSpeed);
    } else {
      if (velocity.current > 0) {
        velocity.current = Math.max(velocity.current - deceleration, 0);
      } else if (velocity.current < 0) {
        velocity.current = Math.min(velocity.current + deceleration, 0);
      }
    }

    const forward = new THREE.Vector3(
      Math.sin(boat.rotation.y),
      0,
      Math.cos(boat.rotation.y),
    );
    boat.position.add(forward.multiplyScalar(velocity.current));
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group
          name="Sketchfab_model"
          rotation={[-Math.PI / 2, 0, 0.9]}
          scale={8.244}
        >
          <group
            name="3e1460bd175d4d8dbdfdcbf4a89a6c5dfbx"
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.01}
          >
            <group name="Object_2">
              <group name="RootNode">
                <group name="sweep15" position={[0, 0.537, 0]} />
                <group
                  name="pPipe7"
                  position={[2.619, 3.244, 8.097]}
                  rotation={[-Math.PI, -1.413, -Math.PI]}
                  scale={0.124}
                />
                <group
                  name="pCylinder7"
                  position={[3.427, -16.632, -0.776]}
                  scale={1.498}
                />
                <group name="polySurface192" position={[0, 0, 11.776]}>
                  <group name="polySurface196">
                    <group name="transform71" />
                  </group>
                  <group name="polySurface197">
                    <group name="transform70" />
                  </group>
                  <group name="polySurface198">
                    <group name="transform72" />
                  </group>
                  <group name="transform69" />
                </group>
                <group
                  name="polySurface202"
                  position={[1.296, 8.667, 2.269]}
                  rotation={[0, 0.653, 0]}
                >
                  <mesh
                    name="polySurface202_aiStandardSurface1_0"
                    castShadow
                    receiveShadow
                    geometry={
                      nodes.polySurface202_aiStandardSurface1_0.geometry
                    }
                    material={materials.aiStandardSurface1}
                  />
                  <mesh
                    name="polySurface202_aiStandardSurface1_0_1"
                    castShadow
                    receiveShadow
                    geometry={
                      nodes.polySurface202_aiStandardSurface1_0_1.geometry
                    }
                    material={materials.aiStandardSurface1}
                  />
                  <mesh
                    name="polySurface202_aiStandardSurface2_0"
                    castShadow
                    receiveShadow
                    geometry={
                      nodes.polySurface202_aiStandardSurface2_0.geometry
                    }
                    material={materials.aiStandardSurface2}
                  />
                  <mesh
                    name="polySurface202_aiStandardSurface2_0_1"
                    castShadow
                    receiveShadow
                    geometry={
                      nodes.polySurface202_aiStandardSurface2_0_1.geometry
                    }
                    material={materials.aiStandardSurface2}
                  />
                  <mesh
                    name="polySurface202_aiStandardSurface3_0"
                    castShadow
                    receiveShadow
                    geometry={
                      nodes.polySurface202_aiStandardSurface3_0.geometry
                    }
                    material={materials.aiStandardSurface3}
                  />
                  <mesh
                    name="polySurface202_aiStandardSurface3_0_1"
                    castShadow
                    receiveShadow
                    geometry={
                      nodes.polySurface202_aiStandardSurface3_0_1.geometry
                    }
                    material={materials.aiStandardSurface3}
                  />
                  <mesh
                    name="polySurface202_aiStandardSurface3_0_2"
                    castShadow
                    receiveShadow
                    geometry={
                      nodes.polySurface202_aiStandardSurface3_0_2.geometry
                    }
                    material={materials.aiStandardSurface3}
                  />
                  <mesh
                    name="polySurface202_aiStandardSurface3_0_3"
                    castShadow
                    receiveShadow
                    geometry={
                      nodes.polySurface202_aiStandardSurface3_0_3.geometry
                    }
                    material={materials.aiStandardSurface3}
                  />
                  <mesh
                    name="polySurface202_aiStandardSurface4_0"
                    castShadow
                    receiveShadow
                    geometry={
                      nodes.polySurface202_aiStandardSurface4_0.geometry
                    }
                    material={materials.aiStandardSurface4}
                  />
                  <mesh
                    name="polySurface202_aiStandardSurface4_0_1"
                    castShadow
                    receiveShadow
                    geometry={
                      nodes.polySurface202_aiStandardSurface4_0_1.geometry
                    }
                    material={materials.aiStandardSurface4}
                  />
                  <mesh
                    name="polySurface202_aiStandardSurface4_0_2"
                    castShadow
                    receiveShadow
                    geometry={
                      nodes.polySurface202_aiStandardSurface4_0_2.geometry
                    }
                    material={materials.aiStandardSurface4}
                  />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
});

useGLTF.preload("/models/fishing_boat.glb");
