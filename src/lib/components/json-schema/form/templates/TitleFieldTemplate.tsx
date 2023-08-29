/* eslint-disable @typescript-eslint/no-explicit-any */
import { Text } from "@chakra-ui/react";
import type { TitleFieldProps } from "@rjsf/utils";
/** The `TitleField` is the template to use to render the title of a field
 *
 * @param props - The `TitleFieldProps` for this component
 */
export default function TitleFieldTemplate<T = any, F = any>(
  props: TitleFieldProps<T, F>
) {
  const { id, title } = props;
  return (
    <Text id={id} variant="body3" fontWeight={700}>
      {title}
      {/* {required && (
        <span className="required" style={{ marginLeft: "4px", color: "red" }}>
          *
        </span>
      )} */}
    </Text>
  );
}
