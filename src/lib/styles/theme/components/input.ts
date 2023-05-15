import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Input: ComponentStyleConfig = {
  variants: {
    "custom-outline": {
      field: {
        color: "text.main",
        border: "1px solid",
        borderColor: "pebble.700",
        background: "none",
        borderRadius: "8px",
        _hover: {
          borderColor: "pebble.600",
        },
        _focusWithin: {
          borderColor: "lilac.main",
          borderWidth: "2px",
        },
        _active: {
          borderColor: "lilac.main",
          borderWidth: "2px",
        },
        _disabled: {
          borderStyle: "dashed",
          color: "text.disabled",
        },
        _invalid: {
          borderColor: "error.main",
        },
        _placeholder: { color: "pebble.600", fontWeight: 500 },
      },
    },
  },
  sizes: {
    md: {
      field: {
        padding: "8px 12px",
      },
    },
    lg: {
      field: {
        height: "56px",
        padding: "16px 12px",
        fontSize: "16px",
      },
    },
  },
  defaultProps: {
    size: "md",
    variant: "custom-outline",
  },
};
