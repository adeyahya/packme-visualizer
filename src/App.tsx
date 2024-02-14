import { Flex } from "@chakra-ui/react";

function App() {
  return (
    <Flex flexDir="column" w="100svw" h="100svh" as="main">
      <Flex flex={1}>Main</Flex>
      <Flex bg="gray.200" w="full" h="20">
        controls
      </Flex>
    </Flex>
  );
}

export default App;
