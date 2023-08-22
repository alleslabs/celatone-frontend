import { Flex, Tag } from "@chakra-ui/react";
import type { RJSFSchema } from "@rjsf/utils";

export const FieldTypeTag = ({
  type,
  format,
}: Pick<RJSFSchema, "type" | "format">) => {
  if (!type) return null;
  if (Array.isArray(type)) {
    const types: string[] = type;
    return (
      <Flex gap={1}>
        {types.map((value) => (
          // NOTE: Assuming there is only one Nonnullable type,
          // since `format` is of type string
          <Tag key={value} variant="gray" size="xs">
            {value !== "null" ? format ?? value : value}
          </Tag>
        ))}
      </Flex>
    );
  }
  return (
    <Tag variant="gray" size="xs">
      {format ?? type}
    </Tag>
  );
};
