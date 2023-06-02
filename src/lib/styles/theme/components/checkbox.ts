import type { ComponentStyleConfig } from "@chakra-ui/react";

const primary = "primary.light";
export const Checkbox: ComponentStyleConfig = {
  baseStyle: {
    control: {
      _checked: {
        bg: primary,
        borderColor: primary,
        _hover: {
          bg: primary,
          borderColor: primary,
        },
      },
    },
  },
};
