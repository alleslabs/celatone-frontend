/* eslint-disable @typescript-eslint/no-explicit-any */
import { Text } from "@chakra-ui/react";
import type {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  TitleFieldProps,
} from "@rjsf/utils";

/** The `TitleField` is the template to use to render the title of a field
 *
 * @param props - The `TitleFieldProps` for this component
 */
export default function TitleField<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: TitleFieldProps<T, S, F>) {
  const { id, title, required } = props;
  return (
    <Text id={id} variant="body3" fontWeight={700}>
      {title}
      {required && (
        <span
          className="required"
          style={{
            marginLeft: "4px",
            color: "var(--chakra-colors-error-light)",
          }}
        >
          *
        </span>
      )}
    </Text>
  );
}
