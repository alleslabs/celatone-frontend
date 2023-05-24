import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Spinner: ComponentStyleConfig = {
  baseStyle: {
    color: "gray.600",
    speed: "0.65s",
  },
  variants: {
    primary: {
      color: "primary.light",
    },
    light: {
      color: "text.main",
    },
  },
};
