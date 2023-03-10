import type { ComponentStyleConfig } from "@chakra-ui/react";

const violetLight = "violet.light";

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
        borderColor: violetLight,
        background: "transparent",
        color: violetLight,
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

  variants: {
    card: {
      container: {
        minW: "fit-content",
        w: "full",
        px: "23px",
        py: "12px",
        border: "2px solid",
        borderRadius: "12px",
        borderColor: "pebble.700",
        bgColor: "pebble.900",
        overflowX: "scroll",
        "&[data-checked]": {
          borderColor: violetLight,
          bgColor: "violet.background",
        },
      },
      control: {
        boxSize: "18px",
      },
      label: {
        w: "inherit",
      },
    },
  },
};
