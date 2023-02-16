import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Radio: ComponentStyleConfig = {
  baseStyle: {
    label: {
      fontWeight: 500,
      color: "text.main",
      ml: "16px",
      pointerEvents: "none",
    },
    control: {
      borderColor: "text.dark",
      _checked: {
        borderColor: "violet.light",
        background: "transparent",
        color: "violet.light",
        _before: {
          w: "10px",
          h: "10px",
        },
        _hover: {
          borderColor: "unset",
          background: "transparent",
        },
        _focusVisible: {
          boxShadow: "none",
        },
      },
    },
  },
  sizes: {
    lg: {
      label: {
        fontSize: "16px",
      },
    },
  },
};
