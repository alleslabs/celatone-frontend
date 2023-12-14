import { tagAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tagAnatomy.keys);

const teal = definePartsStyle({
  container: {
    bg: "#69DEC9",
    color: "gray.900",
  },
});

const accentDark = definePartsStyle({
  container: {
    bg: "accent.dark",
    color: "gray.900",
  },
});

const accentDarker = definePartsStyle({
  container: {
    bg: "accent.darker",
    color: "text.main",
  },
});

const primaryLight = definePartsStyle({
  container: {
    bg: "primary.light",
    color: "gray.900",
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
      px: 2,
      py: 0,
      borderRadius: "full",
      lineHeight: "100%",
      textAlign: "center",
    },
  },
  sizes: {
    xs: {
      container: {
        maxH: "18px",
        height: "18px",
        fontSize: "12px",
      },
    },
    sm: {
      container: {
        maxH: "20px",
        fontSize: "12px",
      },
    },
    md: {
      container: {
        maxH: "24px",
        fontSize: "12px",
      },
    },
  },
  variants: {
    "primary-light": primaryLight,
    "accent-dark": accentDark,
    "accent-darker": accentDarker,
    teal,
    gray,
  },
  defaultProps: {
    size: "md",
    variant: "accent-darker",
  },
});
