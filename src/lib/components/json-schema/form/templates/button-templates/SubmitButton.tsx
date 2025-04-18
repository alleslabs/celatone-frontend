/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  SubmitButtonProps,
} from "@rjsf/utils";

import { Box, Button } from "@chakra-ui/react";
import { getSubmitButtonOptions } from "@rjsf/utils";

export default function SubmitButton<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({ uiSchema }: SubmitButtonProps<T, S, F>) {
  const {
    norender,
    props: submitButtonProps,
    submitText,
  } = getSubmitButtonOptions(uiSchema);
  if (norender) {
    return null;
  }

  return (
    <Box display="flex" justifyContent="end" marginTop={3}>
      <Button type="submit" {...submitButtonProps}>
        {submitText}
      </Button>
    </Box>
  );
}
