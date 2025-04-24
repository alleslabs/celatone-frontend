import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Select: ComponentStyleConfig = {
  defaultProps: {
    variant: "custom-select",
  },
  variants: {
    "custom-select": {
      field: {
        _active: {
          borderColor: "primary.dark",
          borderWidth: "2px",
        },
        _focus: {
          borderColor: "primary.dark",
          borderWidth: "2px",
        },
        bg: "background.main",
        border: "1px solid",
        borderColor: "gray.700",
        borderRadius: "8px",
        color: "text.main",
        fontSize: "16px",
        height: "56px",
        letterSpacing: "0.15px",
      },
      icon: {
        color: "text.dark",
        fontSize: "24px",
      },
    },
  },
};
