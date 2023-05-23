import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Textarea: ComponentStyleConfig = {
  variants: {
    "custom-outline": {
      color: "text.main",
      border: "1px solid",
      borderColor: "gray.700",
      background: "none",
      borderRadius: "8px",
      p: "16px 12px",
      height: "112px",
      _hover: {
        borderColor: "gray.700",
      },
      _focusWithin: {
        borderColor: "secondary.main",
        borderWidth: "2px",
      },
      _active: {
        borderColor: "secondary.main",
        borderWidth: "2px",
      },
      _disabled: {
        borderStyle: "dashed",
        color: "text.disabled",
      },
      _invalid: {
        borderColor: "error.main",
      },
      _placeholder: { color: "gray.600" },
    },
  },
  defaultProps: {
    variant: "custom-outline",
  },
};
