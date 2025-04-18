import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Badge: ComponentStyleConfig = {
  baseStyle: {
    borderRadius: "16px",
    fontSize: "12px",
    fontWeight: "400",
    letterSpacing: "0.17px",
    lineHeight: "100%",
    maxH: "20px",
    p: "4px 8px",
    textAlign: "center",
  },
  defaultProps: {
    variant: "gray",
  },
  variants: {
    gray: {
      background: "gray.700",
      color: "text.main",
    },
    primary: { background: "primary.darker", color: "text.main" },
    "primary-light": {
      background: "primary.main",
      color: "background.main",
    },
  },
};
