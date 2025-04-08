import type { Option } from "lib/types";
import type { FieldPath, FieldValues } from "react-hook-form";

import { Button, Flex, Text } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";
import { useController, useWatch } from "react-hook-form";

import type { FieldProps } from "./types";

import { getDefaultValueFromDimensions } from "../utils";
import { Field } from "./Field";

interface FieldTemplateProps<T extends FieldValues> extends FieldProps<T> {
  dimensions?: Option<number>[];
}

export const FieldTemplate = <T extends FieldValues>({
  control,
  name,
  components,
  dimensions = [],
  ...rest
}: FieldTemplateProps<T>) => {
  const {
    field: { onChange },
  } = useController<T>({
    control,
    name,
  });

  const value = useWatch({ control, name });

  if (dimensions.length === 0)
    return (
      <Field components={components} control={control} name={name} {...rest} />
    );

  const [currentDimension, ...restDimensions] = dimensions;
  const isDynamic = currentDimension === undefined;

  const arrayValue = value as unknown[];
  return (
    <Flex
      border="1px solid var(--chakra-colors-gray-700)"
      borderRadius="8px"
      direction="column"
      gap={2}
      p={4}
      w="full"
    >
      {arrayValue.length ? (
        <>
          {arrayValue.map((_, index) => (
            <Flex key={index} align="center" gap={4}>
              <FieldTemplate
                components={components}
                control={control}
                dimensions={restDimensions}
                name={`${name}.${index}` as FieldPath<T>}
                {...rest}
              />
              {isDynamic && (
                <Button
                  h="56px"
                  p={0}
                  size="lg"
                  variant="outline-gray"
                  w="56px"
                  onClick={() =>
                    onChange(arrayValue.filter((_, i) => i !== index))
                  }
                >
                  <CustomIcon boxSize={3} name="delete" />
                </Button>
              )}
            </Flex>
          ))}
        </>
      ) : (
        <Text color="text.dark" textAlign="center" variant="body2">
          Left blank to send as empty array
        </Text>
      )}
      {isDynamic && (
        <Button
          leftIcon={<CustomIcon name="plus" />}
          mx="auto"
          variant="outline-gray"
          onClick={() =>
            onChange([
              ...value,
              getDefaultValueFromDimensions(restDimensions, components),
            ])
          }
        >
          Add item
        </Button>
      )}
    </Flex>
  );
};
