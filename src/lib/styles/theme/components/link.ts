import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Link: ComponentStyleConfig = {
  baseStyle: {
    color: "secondary.main",
    fontSize: "14px",
    "&.ellipsis": {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
};
