/* eslint-disable @typescript-eslint/no-explicit-any */
import { TranslatableString } from "@rjsf/utils";
import type {
  FormContextType,
  IconButtonProps,
  RJSFSchema,
  StrictRJSFSchema,
} from "@rjsf/utils";

import { CustomIcon } from "lib/components/icon";

import ChakraIconButton from "./ChakraIconButton";

export function MoveDownButton<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: IconButtonProps<T, S, F>) {
  const {
    registry: { translateString },
  } = props;
  return (
    <ChakraIconButton<T, S, F>
      className="array-item-move-down"
      title={translateString(TranslatableString.MoveDownButton)}
      {...props}
      icon={<CustomIcon name="arrow-down" />}
    />
  );
}

export function MoveUpButton<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: IconButtonProps<T, S, F>) {
  const {
    registry: { translateString },
  } = props;
  return (
    <ChakraIconButton<T, S, F>
      className="array-item-move-up"
      title={translateString(TranslatableString.MoveUpButton)}
      {...props}
      icon={<CustomIcon name="arrow-up" />}
    />
  );
}

export function RemoveButton<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: IconButtonProps<T, S, F>) {
  const {
    registry: { translateString },
  } = props;
  return (
    <ChakraIconButton<T, S, F>
      className="array-item-remove"
      title={translateString(TranslatableString.RemoveButton)}
      {...props}
      icon={<CustomIcon name="delete" boxSize={3} />}
    />
  );
}
