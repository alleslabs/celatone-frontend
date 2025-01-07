import { tagAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(tagAnatomy.keys);

const teal = definePartsStyle({
  container: {
    bg: "#69DEC9",
    color: "gray.900",
  },
});

const secondary = definePartsStyle({
  container: {
    bg: "secondary.main",
    color: "gray.900",
  },
});

const primaryLight = definePartsStyle({
  container: {
    bg: "primary.light",
    color: "gray.900",
  },
});

const primaryDarker = definePartsStyle({
  container: {
    bg: "primary.darker",
    color: "text.main",
  },
});

const gray = definePartsStyle({
  container: {
    bg: "gray.700",
    color: "text.main",
  },
});

export const Tag = defineMultiStyleConfig({
  baseStyle: {
    container: {
      borderRadius: "full",
      lineHeight: "100%",
      px: 2,
      py: 1,
      textAlign: "center",
    },
  },
  defaultProps: {
    size: "md",
    variant: "primary-darker",
  },
  sizes: {
    md: {
      container: {
        fontSize: "12px",
      },
    },
    sm: {
      container: {
        fontSize: "12px",
      },
    },
    xs: {
      container: {
        fontSize: "12px",
        height: "18px",
      },
    },
  },
  variants: {
    gray,
    "primary-darker": primaryDarker,
    "primary-light": primaryLight,
    secondary,
    teal,
  },
});
