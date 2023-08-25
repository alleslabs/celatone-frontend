/* eslint-disable @typescript-eslint/no-explicit-any */
import { Text } from "@chakra-ui/react";
import type { DescriptionFieldProps } from "@rjsf/utils";

/**
 * Description Field for the jsonschema forms.
 * @param description
 * @param id
 */
const DescriptionFieldTemplate = <T = any, F = any>(
  props: DescriptionFieldProps<T, F>
) => {
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
};

export default DescriptionFieldTemplate;
