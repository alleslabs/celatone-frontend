/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  FormContextType,
  IconButtonProps,
  RJSFSchema,
  StrictRJSFSchema,
} from "@rjsf/utils";

import { Button } from "@chakra-ui/react";
import { TranslatableString } from "@rjsf/utils";

export default function AddButton<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: IconButtonProps<T, S, F>) {
  const {
    registry: { translateString },
  } = props;
  return (
    <Button
      fontSize="12px"
      height="30px"
      title={translateString(TranslatableString.AddButton)}
      variant="outline-primary"
      width="75px"
      {...props}
    >
      Add More
    </Button>
  );
}
