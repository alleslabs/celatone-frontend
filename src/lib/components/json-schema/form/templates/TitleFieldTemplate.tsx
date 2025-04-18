/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  TitleFieldProps,
} from "@rjsf/utils";

import { Text } from "@chakra-ui/react";

/** The `TitleField` is the template to use to render the title of a field
 *
 * @param props - The `TitleFieldProps` for this component
 */
export default function TitleField<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: TitleFieldProps<T, S, F>) {
  const { id, required, title } = props;
  return (
    <Text id={id} fontWeight={700} variant="body3">
      {title}
      {required && (
        <span
          className="required"
          style={{
            color: "var(--chakra-colors-error-light)",
            marginLeft: "4px",
          }}
        >
          *
        </span>
      )}
    </Text>
  );
}
