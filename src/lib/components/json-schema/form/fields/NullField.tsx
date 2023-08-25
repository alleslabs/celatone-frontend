/* eslint-disable @typescript-eslint/no-explicit-any */
import { Text } from "@chakra-ui/react";
import type { FieldProps } from "@rjsf/utils";
import { useEffect } from "react";

/** The `NullField` component is used to render a field in the schema is null. It also ensures that the `formData` is
 * also set to null if it has no value.
 *
 * @param props - The `FieldProps` for this template
 */
function NullField<T = any, F = any>(props: FieldProps<T, F>) {
  const { idSchema, formData, onChange } = props;
  useEffect(() => {
    if (formData === undefined) {
      onChange(null as unknown as T);
    }
  }, [formData, onChange]);
  return idSchema.$id === "root" ? (
    <Text
      variant="body3"
      fontWeight={700}
      textColor="text.disabled"
      textAlign="center"
      p={4}
      bgColor="gray.700"
      borderRadius="8px"
    >
      NULL
    </Text>
  ) : null;
}

export default NullField;
