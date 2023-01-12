import { defineStyleConfig } from "@chakra-ui/react";
import type { StyleConfig } from "@chakra-ui/react";

const styles: StyleConfig = {
  baseStyle: {
    borderRadius: "8px",
    color: "text.main",
    padding: "8px 16px",
    mb: "4px",
    fontWeight: 400,
    fontSize: "14px",
    maxW: "280px",
  },
};

export const Tooltip = defineStyleConfig(styles);
