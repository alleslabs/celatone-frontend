import { Button, Flex, Text } from "@chakra-ui/react";
import type { FieldPath, FieldValues } from "react-hook-form";
import { useController } from "react-hook-form";
import { CustomIcon } from "lib/components/icon";
import type { Option } from "lib/types";
import { Field } from "./Field";
import type { FieldProps } from "./types";
import { getDefaultValueFromDimensions } from "../utils";

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
    field: { value, onChange },
  } = useController<T>({
    control,
    name,
  });

  if (dimensions.length === 0)
    return (
      <Field control={control} name={name} components={components} {...rest} />
    );

  const [currentDimension, ...restDimensions] = dimensions;
  const isDynamic = currentDimension === undefined;

  const arrayValue = value as unknown[];
  return (
    <Flex
      direction="column"
      gap={2}
      w="full"
      p={4}
      border="1px solid var(--chakra-colors-gray-700)"
      borderRadius="8px"
    >
      {arrayValue.length ? (
        <>
          {arrayValue.map((_, index) => (
            <Flex key={index} align="center" gap={4}>
              <FieldTemplate
                name={`${name}.${index}` as FieldPath<T>}
                control={control}
                components={components}
                dimensions={restDimensions}
                {...rest}
              />
              {isDynamic && (
                <Button
                  w="56px"
                  h="56px"
                  variant="outline-gray"
                  size="lg"
                  onClick={() =>
                    onChange(arrayValue.filter((_, i) => i !== index))
                  }
                  p={0}
                >
                  <CustomIcon name="delete" boxSize={3} />
                </Button>
              )}
            </Flex>
          ))}
        </>
      ) : (
        <Text variant="body2" color="text.dark" textAlign="center">
          Left blank to send as empty array
        </Text>
      )}
      {isDynamic && (
        <Button
          variant="outline-gray"
          mx="auto"
          onClick={() =>
            onChange([
              ...value,
              getDefaultValueFromDimensions(restDimensions, components),
            ])
          }
          leftIcon={<CustomIcon name="plus" />}
        >
          Add Item
        </Button>
      )}
    </Flex>
  );
};
