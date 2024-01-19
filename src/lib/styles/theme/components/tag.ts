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
      py: 1,
      borderRadius: "full",
      lineHeight: "100%",
      textAlign: "center",
    },
  },
  sizes: {
    xs: {
      container: {
        height: "18px",
        fontSize: "12px",
      },
    },
    sm: {
      container: {
        fontSize: "12px",
      },
    },
    md: {
      container: {
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
