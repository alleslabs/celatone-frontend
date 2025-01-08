import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Badge: ComponentStyleConfig = {
  baseStyle: {
    p: "4px 8px",
    borderRadius: "16px",
    fontWeight: "400",
    fontSize: "12px",
    lineHeight: "100%",
    letterSpacing: "0.17px",
    textAlign: "center",
    maxH: "20px",
  },
  variants: {
    primary: { background: "primary.darker", color: "text.main" },
    gray: {
      background: "gray.700",
      color: "text.main",
    },
    "primary-light": {
      background: "primary.main",
      color: "background.main",
    },
  },
  defaultProps: {
    variant: "gray",
  },
};
