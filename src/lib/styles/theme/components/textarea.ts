import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Textarea: ComponentStyleConfig = {
  variants: {
    "custom-outline": {
      color: "text.main",
      border: "1px solid rgba(255,255,255,0.12)",
      background: "none",
      borderRadius: "4px",
      p: "16px 12px",
      height: "112px",
      _hover: {
        borderColor: "gray.600",
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
      _placeholder: { color: "text.dark" },
    },
  },
  defaultProps: {
    variant: "custom-outline",
  },
};
