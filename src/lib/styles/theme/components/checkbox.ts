import type { ComponentStyleConfig } from "@chakra-ui/react";

const violet = "violet.light";
export const Checkbox: ComponentStyleConfig = {
  baseStyle: {
    control: {
      _checked: {
        bg: violet,
        borderColor: violet,
        _hover: {
          bg: violet,
          borderColor: violet,
        },
      },
    },
  },
};
