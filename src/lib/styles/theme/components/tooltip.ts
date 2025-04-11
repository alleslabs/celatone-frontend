import type { ComponentStyleConfig } from "@chakra-ui/react";

import { cssVar } from "@chakra-ui/react";

const $arrowBg = cssVar("popper-arrow-bg");

export const Tooltip: ComponentStyleConfig = {
  baseStyle: {
    borderRadius: "8px",
    color: "text.main",
    padding: "8px 16px",
    mb: "4px",
    fontWeight: 400,
    fontSize: "14px",
    maxW: "280px",
    bg: "primary.darker",
    [$arrowBg.variable]: "colors.primary.darker",
  },
  variants: {
    "primary-light": {
      color: "gray.900",
      bg: "primary.light",
      [$arrowBg.variable]: "colors.primary.light",
    },
  },
};
