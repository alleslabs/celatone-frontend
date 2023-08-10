/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button } from "@chakra-ui/react";
import type { SubmitButtonProps } from "@rjsf/utils";
import { getSubmitButtonOptions } from "@rjsf/utils";

export default function SubmitButton<T = any, F = any>({
  uiSchema,
}: SubmitButtonProps<T, F>) {
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
