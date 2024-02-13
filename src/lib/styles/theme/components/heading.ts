import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Heading: ComponentStyleConfig = {
  baseStyle: {
    color: "text.main",
    "&.ellipsis": {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
  variants: {
    h1: {
      fontSize: "96px",
      fontWeight: 700,
      letterSpacing: "-1.5px",
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "60px",
      fontWeight: 700,
      letterSpacing: "-0.5px",
      lineHeight: 1.2,
    },
    h3: {
      fontSize: "48px",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: "32px",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "0.25px",
    },
    h5: {
      fontSize: "24px",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "0.25px",
    },
    h6: {
      fontSize: "18px",
      fontWeight: 500,
      lineHeight: 1.2,
      letterSpacing: "0.15px",
    },
    h7: {
      fontSize: "16px",
      fontWeight: 500,
      lineHeight: 1.2,
      letterSpacing: "0px",
    },
  },
};
