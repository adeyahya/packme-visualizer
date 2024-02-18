import { useControls } from "leva";
import { Box } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import { Center, Environment, OrbitControls, Edges } from "@react-three/drei";
import {
  AlgoInput,
  AlgoResult,
  ContainerResult,
  ItemResult,
} from "packme-wasm";
import { useMount } from "./hooks/useMount";
import { useMemo, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";

export default function App() {
  const [isWorkerReady, setWorkerReady] = useState(false);
  const [result, setResult] = useState<AlgoResult | undefined>(undefined);
  const workerRef = useRef<Worker>();
  const { position } = useControls({
    position: { value: [0, -20, 0], step: 1 },
  });

  const workerPack = (input: AlgoInput) => {
    setResult(undefined);
    workerRef.current?.postMessage({ type: "pack", input });
  };

  useMount(() => {
    const setupPacker = async () => {
      const worker = new Worker(new URL("./worker.ts", import.meta.url), {
        type: "module",
      });

      worker.onmessage = (e) => {
        if (e.data === "ready") {
          setWorkerReady(true);
        }

        if (e.data.type === "pack_result") {
          console.log(e.data.data);
          setResult(e.data.data);
        }

        if (e.data.type === "timing") {
          console.log(e.data.data);
        }
      };

      workerRef.current = worker;
    };

    setupPacker();
  });

  const maxZ =
    result?.containers?.reduce((acc, container) => {
      return Math.max(acc, container.dim.height);
    }, 0) || 0;

  return (
    <>
      <Sidebar isPackingReady={isWorkerReady} onPack={workerPack} />
      <Box w="100svw" h="100svh">
        <Canvas shadows camera={{ position: [0, 0, maxZ + 80], fov: 50 }}>
          {maxZ === 0 ? null : (
            <Center>
              <group position={position}>
                {result?.containers?.map((container, idx, arrs) => {
                  let offset = 0;
                  for (let i = 0; i < idx; i++) {
                    offset += arrs[i].dim.length + 10;
                  }
                  return (
                    <group key={idx} position={[offset, 0, 0]}>
                      <Container data={container} />
                    </group>
                  );
                })}
              </group>
            </Center>
          )}
          <Env />
          <OrbitControls enablePan={true} enableZoom={true} />
        </Canvas>
      </Box>
    </>
  );
}

function Container(props: { data: ContainerResult }) {
  const { data } = props;
  const { roughness } = useControls({
    roughness: { value: 1, min: 0, max: 1 },
  });

  return (
    <>
      <mesh
        castShadow
        position={[
          data.dim.length / 2 - 0.2,
          data.dim.width / 2 - 0.2,
          data.dim.height / 2 - 0.2,
        ]}
      >
        <boxGeometry
          args={[
            data.dim.length + 0.2,
            data.dim.width + 0.2,
            data.dim.height + 0.2,
          ]}
        />
        <meshStandardMaterial
          metalness={1}
          roughness={roughness}
          transparent
          opacity={0.1}
        />
        <Edges castShadow />
      </mesh>
      {data.items.map((item, idx) => (
        <BoxItem key={idx} data={item} />
      ))}
    </>
  );
}

function BoxItem(props: { data: ItemResult }) {
  const { data } = props;
  const dim = useMemo(() => {
    let result = [data.dim.length, data.dim.width, data.dim.height];
    switch (data.rot) {
      case "HLW":
        result = [data.dim.height, data.dim.length, data.dim.width];
        break;
      case "LHW":
        result = [data.dim.length, data.dim.height, data.dim.width];
        break;
      case "LWH":
        result = [data.dim.length, data.dim.width, data.dim.height];
        break;
      case "WLH":
        result = [data.dim.width, data.dim.length, data.dim.height];
        break;
      case "WHL":
        result = [data.dim.width, data.dim.height, data.dim.length];
        break;
      default:
    }
    return result;
  }, [data]);
  return (
    <mesh
      position={[
        data.pos.length + dim[0] / 2,
        data.pos.width + dim[1] / 2,
        data.pos.height + dim[2] / 2,
      ]}
      castShadow
    >
      <boxGeometry args={[dim[0], dim[1], dim[2]]} />
      <meshStandardMaterial metalness={1} roughness={1} color="#0fab55" />
      <Edges castShadow />
    </mesh>
  );
}

function Env() {
  const { blur } = useControls({
    blur: { value: 0.65, min: 0, max: 1 },
  });
  return <Environment preset="warehouse" background blur={blur} />;
}
