/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@chakra-ui/react";
import { TranslatableString } from "@rjsf/utils";
import type {
  FormContextType,
  IconButtonProps,
  RJSFSchema,
  StrictRJSFSchema,
} from "@rjsf/utils";

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
      title={translateString(TranslatableString.AddButton)}
      variant="outline-primary"
      width="75px"
      height="30px"
      fontSize="12px"
      {...props}
    >
      Add more
    </Button>
  );
}
