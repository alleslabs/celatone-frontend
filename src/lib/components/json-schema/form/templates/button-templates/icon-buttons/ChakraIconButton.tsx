/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IconButtonProps as ChakraIconButtonProps } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import type {
  FormContextType,
  IconButtonProps,
  RJSFSchema,
  StrictRJSFSchema,
} from "@rjsf/utils";
import { memo } from "react";

function ChakraIconButton<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: IconButtonProps<T, S, F>) {
  const {
    className,
    icon,
    iconType = "default",
    registry,
    title,
    uiSchema,
    ...otherProps
  } = props;
  return (
    <IconButton
      aria-label={`${iconType}-${title}`}
      as="button"
      variant="outline-primary"
      boxSize={9}
      {...otherProps}
      icon={icon as ChakraIconButtonProps["icon"]}
    />
  );
}

ChakraIconButton.displayName = "ChakraIconButton";

export default memo(ChakraIconButton) as typeof ChakraIconButton;
