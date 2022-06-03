import * as THREE from "three";
import { useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Text, Torus, useGLTF, useTexture } from "@react-three/drei";
import { Physics, useSphere, useBox, useCylinder, useTrimesh, usePlane } from "@react-three/cannon";
import { proxy, useSnapshot } from "valtio";
import { GLTFLoader, FBXLoader } from "three-stdlib";
import {useStateContext} from "../context/StateContext"

let playing = true;

function Bucket() {
  const model = useRef()
  // const { nodes, materials } = useGLTF("/models/bucketNoBottom.glb")
  const gltf = useLoader(GLTFLoader, "/models/bucketNoBottom.glb")
  const fbx = useLoader(FBXLoader, "/models/glove.fbx")
  const [ref, api] = useBox(() => ({ type: "Kinematic", args: [1.4, 1, 1.5],  }))

  useFrame((state) => {
    model.current.rotation.x = THREE.MathUtils.lerp(model.current.rotation.x, 0, 0.2)
    model.current.rotation.y = THREE.MathUtils.lerp(model.current.rotation.y, (state.mouse.x * Math.PI) / 5, 0.2)
    api.position.set(state.mouse.x * 10, state.mouse.y * 5, 0)
    api.rotation.set(0, 0, model.current.rotation.y)
  })
  return (
    <mesh name="glove" ref={ref} dispose={null}>
    <group ref={model} position={[0, 0, 0]} scale={0.1}>
        <primitive object={fbx} />
    </group>
  </mesh>

  )
}

function Ball() {
  const { scene } = useThree();
  const [ref, api] = useSphere(() => ({
    mass: 0.7,
    args: [0.5],
    position: [0, 5, 0],
    onCollide: (e) => {
      // console.log(e.body.name);
      if (e.body.name === "glove") {
        // state.api.reset();
        scene.remove(e.target);
        api.sleep = true;
        // scene.add(e.target)
        // api.position.set((Math.random() - 1) * 7, 6, 0);
        // api.velocity.set(0, 5, 0);
      }
    },
  }));
  usePlane(() => ({
    type: "Static",
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -10, 0],
    onCollide: (e) => {
      // console.log(api);
      // scene.remove(e.body);
      // api.sleep = true;
    },
  }));
  return (
    <mesh name="ball" castShadow ref={ref}>
      <sphereGeometry name="ball" args={[0.5, 64, 64]} />
      <meshStandardMaterial />
    </mesh>
  );
}

export default function Home() {
  const { isPlaying, setIsPlaying } = useStateContext();

  console.log(isPlaying)
  return (
    <Canvas shadows camera={{ position: [0, 5, 12], fov: 50 }}>
      <color attach="background" args={["#171720"]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[-10, -10, -10]} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.4}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      <Physics
        iterations={20}
        tolerance={0.0001}
        gravity={[0, -20, 0]}
        defaultContactMaterial={{
          friction: 0.9,
          restitution: 0.7,
          contactEquationStiffness: 1e7,
          contactEquationRelaxation: 1,
          frictionEquationStiffness: 1e7,
          frictionEquationRelaxation: 2,
        }}
      >
        <mesh position={[0, 0, -10]} receiveShadow>
          <planeGeometry args={[1000, 1000]} />
          <meshPhongMaterial color="#374037" />
        </mesh>
        {<Ball />}
        <Bucket />
      </Physics>
    </Canvas>
  );
}
