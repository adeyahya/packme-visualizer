/* eslint-disable @typescript-eslint/no-explicit-any */
import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  HStack,
  Heading,
  IconButton,
  Stack,
  Text,
  Divider,
  Button,
} from "@chakra-ui/react";
import { AlgoInput } from "packme-wasm";
import { Control, useFieldArray } from "react-hook-form";
import Field from "./Field";

type Props = {
  control: Control<AlgoInput, any, AlgoInput>;
};

function BoxFields(props: Props) {
  const { control } = props;
  const boxFields = useFieldArray({ control, name: "items" });
  const add = () => {
    boxFields.append({
      id: `Item ${boxFields.fields.length + 1}`,
      dim: [0, 0, 0],
      qty: 1,
    });
  };
  const remove = (idx: number) => {
    boxFields.remove(idx);
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
          Items
        </Heading>
        <IconButton
          onClick={add}
          size="xs"
          aria-label="add"
          icon={<AddIcon />}
        />
      </Flex>
      <Stack px="3" divider={<Divider />} spacing="4">
        {boxFields.fields.map((field, idx) => (
          <Box key={field.id} borderRadius="md" p="1">
            <HStack>
              <Field label="Label" name={`items.${idx}.id`} control={control} />
              <Field
                flex="1"
                label="Qty"
                name={`items.${idx}.qty`}
                control={control}
                options={{ valueAsNumber: true, min: 1, required: true }}
              />
            </HStack>
            <Box mt="1">
              <Text fontSize="xs" mb="1">
                Dimensions
              </Text>
              <HStack>
                <Field
                  flex="1"
                  name={`items.${idx}.dim.0`}
                  control={control}
                  options={{ valueAsNumber: true, min: 1, required: true }}
                />
                <Field
                  flex="1"
                  name={`items.${idx}.dim.1`}
                  control={control}
                  options={{ valueAsNumber: true, min: 1, required: true }}
                />
                <Field
                  flex="1"
                  name={`items.${idx}.dim.2`}
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

export default BoxFields;
