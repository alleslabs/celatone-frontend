/* eslint-disable @typescript-eslint/no-explicit-any */
import { Text } from "@chakra-ui/react";
import type {
  FieldProps,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
} from "@rjsf/utils";

/** The `NullField` component is used to render a field in the schema is null. It also ensures that the `formData` is
 * also set to null if it has no value.
 *
 * @param props - The `FieldProps` for this template
 */
function NullField<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: FieldProps<T, S, F>) {
  const { idSchema } = props;
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
