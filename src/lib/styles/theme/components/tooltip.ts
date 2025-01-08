import type { ComponentStyleConfig } from "@chakra-ui/react";
import { cssVar } from "@chakra-ui/react";

const $arrowBg = cssVar("popper-arrow-bg");

export const Tooltip: ComponentStyleConfig = {
  baseStyle: {
    [$arrowBg.variable]: "colors.primary.darker",
    bg: "primary.darker",
    borderRadius: "8px",
    color: "text.main",
    fontSize: "14px",
    fontWeight: 400,
    maxW: "280px",
    mb: "4px",
    padding: "8px 16px",
  },
  variants: {
    "primary-light": {
      [$arrowBg.variable]: "colors.primary.light",
      bg: "primary.light",
      color: "gray.900",
    },
  },
};
