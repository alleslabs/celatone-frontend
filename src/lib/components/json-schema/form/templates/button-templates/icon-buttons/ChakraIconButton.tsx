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
    iconType = "default",
    icon,
    className,
    uiSchema,
    registry,
    title,
    ...otherProps
  } = props;
  return (
    <IconButton
      as="button"
      variant="outline-primary"
      boxSize={9}
      aria-label={`${iconType}-${title}`}
      {...otherProps}
      icon={icon as ChakraIconButtonProps["icon"]}
    />
  );
}

ChakraIconButton.displayName = "ChakraIconButton";

export default memo(ChakraIconButton) as typeof ChakraIconButton;
