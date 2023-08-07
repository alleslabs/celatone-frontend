import { Flex, Tag } from "@chakra-ui/react";
import type { RJSFSchema } from "@rjsf/utils";

export const FieldTypeTag = ({ type }: Pick<RJSFSchema, "type">) => {
  if (!type) return null;
  if (Array.isArray(type)) {
    const types: string[] = type;
    return (
      <Flex gap={1}>
        {types.map((value) => (
          <Tag key={value} variant="gray" size="xs">
            {value}
          </Tag>
        ))}
      </Flex>
    );
  }
  return (
    <Tag variant="gray" size="xs">
      {type}
    </Tag>
  );
};
