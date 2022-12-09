import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Badge: ComponentStyleConfig = {
  baseStyle: {
    p: "2px 8px",
    borderRadius: "16px",
    fontWeight: "400",
    fontSize: "12px",
    lineHeight: "143%",
    letterSpacing: "0.17px",
  },
  variants: {
    primary: { background: "primary.dark", color: "rgba(255, 255, 255, 1)" },
    gray: {
      background: "rgba(255, 255, 255, 0.12)",
      color: "rgba(255, 255, 255, 0.5)",
    },
  },
};
