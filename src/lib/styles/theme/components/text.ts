import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Text: ComponentStyleConfig = {
  baseStyle: {
    "&.ellipsis": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    color: "text.main",
  },
  variants: {
    body1: {
      fontSize: "16px",
      fontWeight: 400,
      letterSpacing: "0.15px",
    },
    body2: {
      fontSize: "14px",
      fontWeight: 400,
      letterSpacing: "0.1px",
    },
    body3: {
      fontSize: "12px",
      fontWeight: 400,
      letterSpacing: "0.1px",
    },
    small: {
      fontSize: "10px",
      fontWeight: 400,
      letterSpacing: "0.1px",
    },
  },
};
