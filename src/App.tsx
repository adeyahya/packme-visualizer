import { Flex, Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { visualizer } from "./lib/visualizer";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const { dispose } = visualizer(canvasRef.current);

    return dispose;
  }, []);

  return (
    <Flex flexDir="column" w="100svw" h="100svh" as="main">
      <Box ref={canvasRef} w="full" h="100svh" as="canvas" />
    </Flex>
  );
}

export default App;
