import { radioAnatomy } from "@chakra-ui/anatomy";
import type { SystemStyleObject } from "@chakra-ui/react";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  radioAnatomy.keys
);

const primaryLight = "primary.light";
const textMain = "text.main";

const generateCardStyle = ({
  containerChecked,
  controlChecked,
}: {
  containerChecked: SystemStyleObject;
  controlChecked?: SystemStyleObject;
}) => ({
  container: {
    minW: "fit-content",
    w: "full",
    px: "24px",
    py: "16px",
    border: "2px solid",
    borderRadius: "12px",
    borderColor: "gray.700",
    bgColor: "gray.900",
    overflowX: "scroll",
    "&[data-checked]": containerChecked,
  },
  control: {
    boxSize: "18px",
    _checked: controlChecked,
  },
  label: { w: "inherit" },
});

export const Radio = defineMultiStyleConfig({
  baseStyle: {
    label: {
      fontWeight: 500,
      color: "text.main",
      ml: "16px",
      pointerEvents: "none",
    },
    control: {
      borderColor: "text.dark",
      _checked: {
        borderColor: primaryLight,
        background: "transparent",
        color: primaryLight,
        _before: {
          w: "10px",
          h: "10px",
        },
        _hover: {
          borderColor: "unset",
          background: "transparent",
        },
        _focusVisible: {
          boxShadow: "none",
        },
      },
    },
  },
  sizes: {
    lg: {
      label: {
        fontSize: "14px",
      },
    },
  },
  variants: {
    "primary-card": generateCardStyle({
      containerChecked: {
        borderColor: primaryLight,
        bgColor: "primary.background",
      },
    }),
    "gray-card": generateCardStyle({
      containerChecked: {
        borderColor: textMain,
        bgColor: "gray.700",
      },
      controlChecked: {
        borderColor: textMain,
        color: textMain,
      },
    }),
  },
  defaultProps: {
    size: "lg",
  },
});
