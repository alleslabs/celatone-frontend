import type { ComponentStyleConfig } from "@chakra-ui/react";

const primaryLight = "primary.light";

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
        borderColor: primaryLight,
        background: "transparent",
        color: primaryLight,
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
        px: "24px",
        py: "12px",
        border: "2px solid",
        borderRadius: "12px",
        borderColor: "gray.700",
        bgColor: "gray.900",
        overflowX: "scroll",
        "&[data-checked]": {
          borderColor: primaryLight,
          bgColor: "primary.background",
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
  defaultProps: {
    size: "lg",
  },
};
