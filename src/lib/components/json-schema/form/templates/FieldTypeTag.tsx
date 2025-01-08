import { Flex, Tag } from "@chakra-ui/react";
import type { RJSFSchema } from "@rjsf/utils";

export const FieldTypeTag = ({
  format,
  type,
}: Pick<RJSFSchema, "format" | "type">) => {
  if (!type) return null;
  if (Array.isArray(type)) {
    const types: string[] = type;
    return (
      <Flex gap={1}>
        {types.map((value) => (
          // NOTE: Assuming there is only one Nonnullable type,
          // since `format` is of type string
          <Tag key={value} size="xs" variant="gray">
            {value !== "null" ? format ?? value : value}
          </Tag>
        ))}
      </Flex>
    );
  }
  return (
    <Tag size="xs" variant="gray">
      {format ?? type}
    </Tag>
  );
};
