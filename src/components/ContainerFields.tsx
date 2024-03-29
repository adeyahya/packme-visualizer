/* eslint-disable @typescript-eslint/no-explicit-any */
import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  HStack,
  Heading,
  IconButton,
  Stack,
  Divider,
  Button,
} from "@chakra-ui/react";
import { AlgoInput } from "packme-wasm";
import { Control, useFieldArray } from "react-hook-form";
import Field from "./Field";

type Props = {
  control: Control<AlgoInput, any, AlgoInput>;
};

function ContainerFields(props: Props) {
  const { control } = props;
  const containerFields = useFieldArray({ control, name: "containers" });
  const add = () => {
    containerFields.append({
      id: `Container ${containerFields.fields.length + 1}`,
      dim: [0, 0, 0],
      qty: 1,
    });
  };
  const remove = (idx: number) => {
    containerFields.remove(idx);
  };
  return (
    <>
      <Flex
        zIndex={99}
        px="3"
        py="2"
        bg="rgb(42 45 56 / 100%)"
        position="sticky"
        top="0"
        align="start"
        justify="space-between"
      >
        <Heading size="sm" color="white">
          Containers
        </Heading>
        <IconButton
          onClick={add}
          size="xs"
          aria-label="add"
          icon={<AddIcon />}
        />
      </Flex>
      <Stack px="3" divider={<Divider />} spacing="4">
        {containerFields.fields.map((field, idx) => (
          <Box key={field.id} borderRadius="md" p="1">
            <HStack>
              <Field
                label="Label"
                name={`containers.${idx}.id`}
                control={control}
              />
              <Field
                flex="1"
                label="Qty"
                name={`containers.${idx}.qty`}
                control={control}
                options={{ valueAsNumber: true, min: 1, required: true }}
              />
            </HStack>
            <Box mt="1">
              <HStack>
                <Field
                  flex="1"
                  label="length"
                  name={`containers.${idx}.dim.0`}
                  control={control}
                  options={{ valueAsNumber: true, min: 1, required: true }}
                />
                <Field
                  flex="1"
                  label="width"
                  name={`containers.${idx}.dim.1`}
                  control={control}
                  options={{ valueAsNumber: true, min: 1, required: true }}
                />
                <Field
                  flex="1"
                  label="height"
                  name={`containers.${idx}.dim.2`}
                  control={control}
                  options={{ valueAsNumber: true, min: 1, required: true }}
                />
              </HStack>
            </Box>
            <Button
              size="xs"
              w="full"
              colorScheme="red"
              variant="link"
              onClick={() => remove(idx)}
            >
              Remove
            </Button>
          </Box>
        ))}
      </Stack>
    </>
  );
}

export default ContainerFields;
