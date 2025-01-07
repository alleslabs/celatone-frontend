import type { ComponentStyleConfig } from "@chakra-ui/react";

const primary = "primary.light";
export const Checkbox: ComponentStyleConfig = {
  defaultProps: {
    variant: "primary",
  },
  variants: {
    primary: {
      control: {
        _checked: {
          _hover: {
            bg: primary,
            borderColor: primary,
          },
          bg: primary,
          borderColor: primary,
        },
      },
    },
    white: {
      control: {
        _checked: {
          _hover: {
            bg: "gray.100",
            borderColor: "gray.100",
          },
          bg: "gray.100",
          borderColor: "gray.100",
        },
      },
    },
  },
};
