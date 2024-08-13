import { formAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  formAnatomy.keys
);

const errorMain = "error.main";

const labelStyles = {
  top: 0,
  left: 0,
  zIndex: 1,
  position: "absolute",
  pointerEvents: "none",
  mx: 3,
  px: 1,
  transformOrigin: "left top",
  color: "text.dark",
  fontWeight: "400",
  _disabled: {
    color: "text.disabled",
  },
  _active: {
    color: "primary.dark",
  },
};

const labelTransform = {
  md: "scale(0.75) translateY(-20px)",
  lg: "scale(0.75) translateY(-28px)",
};

const getActiveLabelStyles = (size: "md" | "lg") => ({
  _focusWithin: {
    label: {
      transform: labelTransform[size],
      lineHeight: "1.2",
    },
  },
  "input:not(:placeholder-shown) ~ label, .chakra-select__wrapper ~ label, textarea:not(:placeholder-shown) ~ label, .chakra-react-select--has-value ~ label":
    {
      transform: labelTransform[size],
      lineHeight: "1.2",
    },
});

const subtextStyles = {
  ml: 3,
  mt: 0,
  fontSize: "12px",
  color: "text.dark",
  _disabled: {
    color: "text.disabled",
  },
  "&.chakra-form__error-message": {
    color: errorMain,
  },
};

export const Form = defineMultiStyleConfig({
  baseStyle: {
    container: {
      label: {
        _invalid: { color: errorMain },
      },
      ".error-text": {
        fontSize: "12px",
        mt: 1,
        "&.chakra-form__error-message": {
          color: errorMain,
        },
      },
    },
  },
  variants: {
    "fixed-floating": {
      container: {
        label: {
          ...labelStyles,
          lineHeight: "1.2",
          "&.md-label, &.textarea-label": {
            transform: labelTransform.md,
          },
          "&.lg-label": {
            transform: labelTransform.lg,
          },
        },
        "div.helper-text, .error-text": { ...subtextStyles },
      },
    },
    floating: {
      container: {
        "&.md-form, &.textarea-form": getActiveLabelStyles("md"),
        "&.lg-form": getActiveLabelStyles("lg"),
        label: { ...labelStyles },
        "div.helper-text, .error-text": { ...subtextStyles },
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
});
