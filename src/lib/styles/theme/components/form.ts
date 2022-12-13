import type { ComponentStyleConfig } from "@chakra-ui/react";

const activeLabelStyles = {
  "&.md-form, &.textarea-form": {
    _focusWithin: {
      label: {
        transform: "scale(0.75) translateY(-20px)",
        lineHeight: "1.2",
      },
    },
    "& .floating": {
      transform: "scale(0.75) translateY(-20px)",
      lineHeight: "1.2",
    },
  },
  "&.lg-form": {
    _focusWithin: {
      label: {
        lineHeight: "1.2",
        transform: "scale(0.75) translateY(-28px)",
      },
    },
    "& .floating": {
      transform: "scale(0.75) translateY(-28px)",
      lineHeight: "1.2",
    },
  },
};

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
        ...activeLabelStyles,
        label: {
          top: 0,
          left: 0,
          zIndex: 2,
          mx: 3,
          px: 1,
          position: "absolute",
          fontWeight: "400",
          pointerEvents: "none",
          transformOrigin: "left top",
          color: "text.dark",
          _disabled: {
            color: "text.disabled",
          },
          _active: {
            color: "primary.main",
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
