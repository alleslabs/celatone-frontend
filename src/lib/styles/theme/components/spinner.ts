import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Spinner: ComponentStyleConfig = {
  baseStyle: {
    color: "pebble.600",
    speed: "0.65s",
  },
  variants: {
    primary: {
      color: "violet.light",
    },
    light: {
      color: "text.main",
    },
  },
};
