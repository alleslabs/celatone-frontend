import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Accordion: ComponentStyleConfig = {
  baseStyle: {
    button: {
      p: "0",
    },
    container: {
      borderWidth: "0",
      borderColor: "transparent",
      p: 0,
      bg: "pebble.900",
      hover: {
        bg: "pebble.800",
      },
      borderRadius: "8px",
    },
    panel: {
      borderRadius: "0px 8px 8px 0px",
    },
  },
};
