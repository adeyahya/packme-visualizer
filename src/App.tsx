import { useControls } from "leva";
import { Box } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import { Center, Environment, OrbitControls, Edges } from "@react-three/drei";
import {
  AlgoInput,
  AlgoResult,
  ContainerResult,
  ItemResult,
  init,
} from "packme-wasm";
import { useMount } from "./hooks/useMount";
import { useMemo, useRef, useState } from "react";

export default function App() {
  const [result, setResult] = useState<AlgoResult | undefined>(undefined);
  const packerRef = useRef<Awaited<ReturnType<typeof init>>>();
  const { position } = useControls({
    position: { value: [0, -20, 0], step: 1 },
  });

  useMount(() => {
    const setupPacker = async () => {
      const res = await fetch("/packme.wasm");
      const buffer = await res.arrayBuffer();
      packerRef.current = await init(buffer);

      const data: AlgoInput = {
        containers: [
          {
            id: "container 1",
            qty: 1,
            dim: [30, 20, 30],
          },
          {
            id: "container 2",
            qty: 1,
            dim: [5, 5, 40],
          },
          {
            id: "container 3",
            qty: 1,
            dim: [20, 20, 30],
          },
        ],
        items: [
          {
            id: "item 1",
            qty: 17,
            dim: [10, 10, 12],
          },
          {
            id: "item 2",
            qty: 1,
            dim: [10, 10, 13],
          },
          {
            id: "item 3",
            qty: 1,
            dim: [5, 39.5, 5],
          },
          {
            id: "item 4",
            qty: 200,
            dim: [6, 5, 8],
          },
        ],
      };
      setResult(packerRef.current.pack(data));
    };

    setupPacker();
  });

  const maxZ =
    result?.containers?.reduce((acc, container) => {
      return Math.max(acc, container.dim.height);
    }, 0) || 0;

  return (
    <Box w="100svw" h="100svh">
      <Canvas shadows camera={{ position: [0, 0, maxZ + 80], fov: 50 }}>
        <Center>
          <group position={position}>
            {result?.containers?.map((container, idx, arrs) => {
              let offset = 0;
              for (let i = 0; i < idx; i++) {
                offset += arrs[i].dim.length + 10;
              }
              return (
                <group key={container.id} position={[offset, 0, 0]}>
                  <Container data={container} />
                </group>
              );
            })}
          </group>
        </Center>
        <Env />
        <OrbitControls enablePan={true} enableZoom={true} />
      </Canvas>
    </Box>
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
