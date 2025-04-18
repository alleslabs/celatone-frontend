import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Input: ComponentStyleConfig = {
  defaultProps: {
    size: "md",
    variant: "custom-outline",
  },
  sizes: {
    lg: {
      field: {
        fontSize: "16px",
        height: "56px",
        padding: "16px 12px",
      },
    },
    md: {
      field: {
        padding: "8px 12px",
      },
    },
  },
  variants: {
    "custom-outline": {
      field: {
        _active: {
          borderColor: "primary.dark",
          borderWidth: "2px",
        },
        _disabled: {
          backgroundColor: "gray.900",
          color: "text.disabled",
          opacity: 0.8,
          pointerEvents: "none",
        },
        _focusWithin: {
          borderColor: "primary.dark",
          borderWidth: "2px",
        },
        _hover: {
          borderColor: "gray.600",
        },
        _invalid: {
          borderColor: "error.main",
        },
        _placeholder: { color: "gray.600" },
        background: "none",
        border: "1px solid",
        borderColor: "gray.700",
        borderRadius: "8px",
        color: "text.main",
      },
    },
  },
};
