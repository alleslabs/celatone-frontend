import { formAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  formAnatomy.keys
);

const errorMain = "error.main";

const labelStyles = {
  _active: {
    color: "primary.dark",
  },
  _disabled: {
    color: "text.disabled",
  },
  color: "text.dark",
  fontWeight: "400",
  left: 0,
  mx: 3,
  pointerEvents: "none",
  position: "absolute",
  px: 1,
  top: 0,
  transformOrigin: "left top",
  zIndex: 1,
};

const labelTransform = {
  lg: "scale(0.75) translateY(-28px)",
  md: "scale(0.75) translateY(-20px)",
};

const getActiveLabelStyles = (size: "lg" | "md") => ({
  _focusWithin: {
    label: {
      lineHeight: "1.2",
      transform: labelTransform[size],
    },
  },
  "input:not(:placeholder-shown) ~ label, .chakra-select__wrapper ~ label, textarea:not(:placeholder-shown) ~ label, .chakra-react-select--has-value ~ label":
    {
      lineHeight: "1.2",
      transform: labelTransform[size],
    },
});

const subtextStyles = {
  _disabled: {
    color: "text.disabled",
  },
  "&.chakra-form__error-message": {
    color: errorMain,
  },
  color: "text.dark",
  fontSize: "12px",
  ml: 3,
  mt: 0,
};

export const Form = defineMultiStyleConfig({
  baseStyle: {
    container: {
      ".error-text": {
        "&.chakra-form__error-message": {
          color: errorMain,
        },
        fontSize: "12px",
        mt: 1,
      },
      label: {
        _invalid: { color: errorMain },
      },
    },
  },
  sizes: {
    lg: {
      container: {
        label: {
          my: 2,
          py: 2,
        },
      },
    },
    md: {
      container: {
        label: {
          my: 1,
          py: 1,
        },
      },
    },
  },
  variants: {
    "fixed-floating": {
      container: {
        "div.helper-text, .error-text": { ...subtextStyles },
        label: {
          ...labelStyles,
          "&.lg-label": {
            transform: labelTransform.lg,
          },
          "&.md-label, &.textarea-label": {
            transform: labelTransform.md,
          },
          lineHeight: "1.2",
        },
      },
    },
    floating: {
      container: {
        "&.lg-form": getActiveLabelStyles("lg"),
        "&.md-form, &.textarea-form": getActiveLabelStyles("md"),
        "div.helper-text, .error-text": { ...subtextStyles },
        label: { ...labelStyles },
      },
    },
  },
});
