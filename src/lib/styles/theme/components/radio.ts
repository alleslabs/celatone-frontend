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
    "&[data-checked]": containerChecked,
    bgColor: "gray.900",
    border: "2px solid",
    borderColor: "gray.700",
    borderRadius: "12px",
    minW: "fit-content",
    overflowX: "scroll",
    px: "24px",
    py: "12px",
    w: "full",
  },
  control: {
    _checked: controlChecked,
    boxSize: "18px",
  },
  label: { w: "inherit" },
});

export const Radio = defineMultiStyleConfig({
  baseStyle: {
    control: {
      _checked: {
        _before: {
          h: "10px",
          w: "10px",
        },
        _focusVisible: {
          boxShadow: "none",
        },
        _hover: {
          background: "transparent",
          borderColor: "unset",
        },
        background: "transparent",
        borderColor: primaryLight,
        color: primaryLight,
      },
      borderColor: "text.dark",
    },
    label: {
      color: "text.main",
      fontWeight: 500,
      ml: "16px",
      pointerEvents: "none",
    },
  },
  defaultProps: {
    size: "lg",
  },
  sizes: {
    lg: {
      label: {
        fontSize: "16px",
      },
    },
  },
  variants: {
    "gray-card": generateCardStyle({
      containerChecked: {
        bgColor: "gray.700",
        borderColor: textMain,
      },
      controlChecked: {
        borderColor: textMain,
        color: textMain,
      },
    }),
    "primary-card": generateCardStyle({
      containerChecked: {
        bgColor: "primary.background",
        borderColor: primaryLight,
      },
    }),
  },
});
