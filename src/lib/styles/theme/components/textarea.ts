import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Textarea: ComponentStyleConfig = {
  defaultProps: {
    variant: "custom-outline",
  },
  variants: {
    "custom-outline": {
      _active: {
        borderColor: "primary.dark",
        borderWidth: "2px",
      },
      _disabled: {
        borderStyle: "dashed",
        color: "text.disabled",
      },
      _focusWithin: {
        borderColor: "primary.dark",
        borderWidth: "2px",
      },
      _hover: {
        borderColor: "gray.700",
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
      height: "112px",
      p: "16px 12px",
    },
  },
};
