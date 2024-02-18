import { Box, Button, Flex } from "@chakra-ui/react";
import { AlgoInput } from "packme-wasm";
import { useForm } from "react-hook-form";
import ContainerFields from "./ContainerFields";
import BoxFields from "./BoxFields";

type Props = {
  isPackingReady?: boolean;
  onPack: (input: AlgoInput) => void;
};

function Sidebar(props: Props) {
  const { isPackingReady } = props;
  const { control, handleSubmit } = useForm<AlgoInput>({
    defaultValues: {
      containers: [],
      items: [],
    },
  });

  const onSubmit = handleSubmit(props.onPack);

  return (
    <Flex
      flexDir="column"
      p="2"
      h="100svh"
      position="fixed"
      top="0"
      right="0"
      zIndex={9}
    >
      <Flex
        flexDir="column"
        flex="1"
        w="320px"
        h="100%"
        bg="rgb(42 45 56 / 100%)"
        overflow="hidden"
        borderRadius="lg"
      >
        <Box flex="1" overflowY="scroll">
          <ContainerFields control={control} />
          <Box w="full" h="1" bg="purple.200" my="4"></Box>
          <BoxFields control={control} />
        </Box>
        <Box w="full" p="2">
          <Button
            size="xs"
            w="full"
            colorScheme="purple"
            onClick={onSubmit}
            isDisabled={!isPackingReady}
          >
            Start Packing
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
}

export default Sidebar;
