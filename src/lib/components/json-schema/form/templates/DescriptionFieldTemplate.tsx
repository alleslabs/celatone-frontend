/* eslint-disable @typescript-eslint/no-explicit-any */
import { Text } from "@chakra-ui/react";
import type {
  DescriptionFieldProps,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
} from "@rjsf/utils";

/** The `DescriptionField` is the template to use to render the description of a field
 *
 * @param props - The `DescriptionFieldProps` for this component
 */
export default function DescriptionField<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: DescriptionFieldProps<T, S, F>) {
  const { id, description } = props;
  if (!description) {
    return null;
  }
  if (typeof description === "string") {
    return (
      <Text
        id={id}
        className="field-description"
        variant="body3"
        textColor="text.dark"
        wordBreak="break-word"
      >
        {description}
      </Text>
    );
  }
  return (
    <div id={id} className="field-description">
      {description}
    </div>
  );
}
