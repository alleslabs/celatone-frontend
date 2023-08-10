/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@chakra-ui/react";
import type { IconButtonProps } from "@rjsf/utils";

export default function AddButton<T = any, F = any>({
  uiSchema,
  ...props
}: IconButtonProps<T, F>) {
  return (
    <Button
      variant="outline-primary"
      width="75px"
      height="30px"
      fontSize="12px"
      {...props}
    >
      Add More
    </Button>
  );
}
