import { accordionAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(accordionAnatomy.keys);

const gray900 = definePartsStyle({
  container: {
    bg: "gray.900",
    borderRadius: "8px",
    hover: {
      bg: "gray.800",
    },
  },
  panel: {
    borderRadius: "0px 8px 8px 0px",
  },
});

const transparent = definePartsStyle({
  container: {
    bg: "transparent",
    borderRadius: "0px",
    hover: {
      bg: "gray.900",
    },
  },
  button: { padding: "12px 0px" },
  panel: {
    borderRadius: "0px",
  },
});
export const Accordion = defineMultiStyleConfig({
  baseStyle: {
    button: {
      p: "0",
    },
    container: {
      borderWidth: "0",
      borderColor: "transparent",
    },
  },
  variants: {
    gray900,
    transparent,
  },
  defaultProps: {
    variant: "gray900",
  },
});
