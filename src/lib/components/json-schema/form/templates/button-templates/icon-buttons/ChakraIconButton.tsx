/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IconButtonProps as ChakraIconButtonProps } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import type { IconButtonProps } from "@rjsf/utils";
import { memo } from "react";

function ChakraIconButton<T = any, F = any>(props: IconButtonProps<T, F>) {
  const { title, icon, iconType, uiSchema, ...otherProps } = props;
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
