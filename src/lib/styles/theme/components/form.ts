import type { ComponentStyleConfig } from "@chakra-ui/react";

export const Form: ComponentStyleConfig = {
  baseStyle: {
    container: {
      label: {
        _invalid: { color: "error.main" },
      },
    },
  },
  variants: {
    floating: {
      container: {
        label: {
          top: 0,
          left: 0,
          zIndex: 2,
          mx: 3,
          px: 1,
          position: "absolute",
          fontWeight: "400",
          lineHeight: "1.2",
          pointerEvents: "none",
          transformOrigin: "left top",
          color: "text.dark",
          _disabled: {
            color: "text.disabled",
          },
          _active: {
            color: "primary.main",
          },
          "&.md-label, &.textarea-label": {
            transform: "scale(0.75) translateY(-20px)",
          },
          "&.lg-label": {
            transform: "scale(0.75) translateY(-28px)",
          },
        },
        "div.helper-text, .error-text": {
          ml: 3,
          mt: 1,
          fontSize: "12px",
          color: "text.dark",
          _disabled: {
            color: "text.disabled",
          },
          "&.chakra-form__error-message": {
            color: "error.main",
          },
        },
      },
    },
  },
  sizes: {
    md: {
      container: {
        label: {
          py: 1,
          my: 1,
        },
      },
    },
    lg: {
      container: {
        label: {
          py: 2,
          my: 2,
        },
      },
    },
  },
};
