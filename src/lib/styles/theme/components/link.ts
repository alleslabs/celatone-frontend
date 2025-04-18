import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Link: ComponentStyleConfig = {
  baseStyle: {
    "&.ellipsis": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    color: "primary.main",
    fontSize: "14px",
  },
};
