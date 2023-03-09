import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Badge: ComponentStyleConfig = {
  baseStyle: {
    p: "4px 8px ",
    borderRadius: "16px",
    fontWeight: "400",
    fontSize: "12px",
    lineHeight: "100%",
    letterSpacing: "0.17px",
  },
  variants: {
    violet: { background: "violet.darker", color: "text.main" },
    gray: {
      background: "pebble.700",
      color: "text.dark",
    },
    honeydew: { background: "honeydew.dark", color: "background.main" },
  },
};
