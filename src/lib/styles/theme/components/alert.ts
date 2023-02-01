import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Alert: ComponentStyleConfig = {
  baseStyle: {
    title: {
      color: "white",
    },
    container: {
      bg: "pebble.800",
    },
  },
  variants: {
    honeydew: {
      title: {
        fontSize: "16px",
        fontWeight: 600,
        letterSpacing: "0.4px",
      },
      container: {
        bg: "honeydew.background",
        border: "1px solid",
        borderColor: "honeydew.main",
        borderRadius: "4px",
        color: "honeydew.main",
      },
      description: {
        fontSize: "12px",
        fontWeight: 400,
        letterSpacing: "0.1px",
      },
    },
  },
};
