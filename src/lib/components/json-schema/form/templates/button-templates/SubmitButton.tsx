/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button } from "@chakra-ui/react";
import type {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  SubmitButtonProps,
} from "@rjsf/utils";
import { getSubmitButtonOptions } from "@rjsf/utils";

export default function SubmitButton<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({ uiSchema }: SubmitButtonProps<T, S, F>) {
  const {
    submitText,
    norender,
    props: submitButtonProps,
  } = getSubmitButtonOptions(uiSchema);
  if (norender) {
    return null;
  }

  return (
    <Box marginTop={3} display="flex" justifyContent="end">
      <Button type="submit" {...submitButtonProps}>
        {submitText}
      </Button>
    </Box>
  );
}
