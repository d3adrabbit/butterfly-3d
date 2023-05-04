import { Suspense, useEffect, useRef } from "react";
import { Canvas, Vector3 } from "@react-three/fiber";
import { Environment, Float, useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { Group, Mesh } from "three";
import { gsap } from "gsap";

type GLTFResult = GLTF & {
  nodes: {
    wing: THREE.Mesh;
  };
  materials: {
    材质: THREE.MeshStandardMaterial;
  };
};

function Model(props: JSX.IntrinsicElements["group"]) {
  const leftRef = useRef<Mesh>(null);
  const rightRef = useRef<Mesh>(null);

  const groupRef = useRef<Group>(null);

  useEffect(() => {
    const wingRotate = 0.1;
    const initWing = gsap.utils.random([-Math.PI / 4]);

    const ctx = gsap.context(() => {
      if (
        groupRef.current?.rotation &&
        leftRef.current?.rotation &&
        rightRef.current?.rotation
      ) {
        gsap.set(groupRef.current?.rotation, {
          x: -Math.PI / 4,
          y: -Math.PI / 16,
          z: -Math.PI / 8,
        });

        gsap.set(leftRef.current.rotation, {
          y: initWing,
        });

        gsap.set(rightRef.current.rotation, {
          y: -initWing,
        });

        gsap
          .timeline()
          .to(
            leftRef.current.rotation,
            {
              y: `-=${Math.PI / 4 - wingRotate}`,
              repeat: -1,
              duration: 0.1,
              yoyo: true,
              ease: "none",
            },
            0
          )
          .to(
            rightRef.current.rotation,
            {
              y: `+=${Math.PI / 4 - wingRotate}`,
              repeat: -1,
              yoyo: true,
              duration: 0.1,
              ease: "none",
            },
            0
          );
      }
    }, groupRef);
    return () => ctx.revert();
  }, [leftRef, rightRef]);

  const { nodes, materials } = useGLTF(
    "/butterfly.json"
  ) as unknown as GLTFResult;
  return (
    <group {...props} dispose={null} ref={groupRef}>
      <mesh
        ref={leftRef}
        castShadow
        receiveShadow
        geometry={nodes.wing.geometry}
        material={materials.材质}
      />
      <mesh
        ref={rightRef}
        castShadow
        receiveShadow
        geometry={nodes.wing.geometry}
        material={materials.材质}
      />
    </group>
  );
}

function App() {
  const positions = [...Array(10)].map(() => ({
    position: [
      10 - Math.random() * 20,
      10 - Math.random() * 20,
      -Math.random() * 20,
    ],
  }));

  return (
    <>
      <div
        className="relative w-screen h-screen bg-aliceblue overflow-hidden"
        style={{
          background: "url(flowers.png) no-repeat center center ",
          backgroundSize: "100% 100%",
          minWidth: "1920px",
        }}
      >
        <div className="">
          <div
            className="absolute center"
            style={{
              color: "#7a9559",
              fontFamily: "Leckerli One",
            }}
          >
            <div className="text-7xl">ButterFly</div>

            <div className="text-lg">Designed by deadrabbit</div>
          </div>
        </div>

        <Canvas
          className="absolute top-0 left-0 w-screen h-screen z-10"
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 0, 8] }}
        >
          <Suspense fallback={null}>
            {positions.map((props, i) => (
              <Float key={i} position={[0, 0, 0]} floatIntensity={2} speed={5}>
                <Model position={props.position as Vector3} />
              </Float>
            ))}

            <ambientLight intensity={0.35} />
            <spotLight
              position={[10, 10, 10]}
              angle={0.15}
              penumbra={1}
              shadow-mapSize={[512, 512]}
              castShadow
            />
            <Environment files={"/forest_slope_1k.hdr"} />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

export default App;
