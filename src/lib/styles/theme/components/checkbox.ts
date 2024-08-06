import type { ComponentStyleConfig } from "@chakra-ui/react";

const primary = "primary.light";
export const Checkbox: ComponentStyleConfig = {
  variants: {
    primary: {
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
    white: {
      control: {
        _checked: {
          bg: "gray.100",
          borderColor: "gray.100",
          _hover: {
            bg: "gray.100",
            borderColor: "gray.100",
          },
        },
      },
    },
  },
  defaultProps: {
    variant: "primary",
  },
};
