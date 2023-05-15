import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Text: ComponentStyleConfig = {
  baseStyle: {
    color: "text.main",
    "&.ellipsis": {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    fontWeight: 500,
  },
  variants: {
    body1: {
      fontSize: "16px",
      fontWeight: 500,
      letterSpacing: "0.2px",
    },
    body2: {
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: "0.2px",
    },
    body3: {
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: "0.2px",
    },
    small: {
      fontSize: "10px",
      fontWeight: 500,
      letterSpacing: "0.2px",
    },
  },
};
