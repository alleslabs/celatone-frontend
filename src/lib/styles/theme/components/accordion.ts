import { accordionAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { defineMultiStyleConfig, definePartsStyle } =
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
  button: { padding: "12px 0px" },
  container: {
    bg: "transparent",
    borderRadius: "0px",
    hover: {
      bg: "gray.900",
    },
  },
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
      borderColor: "transparent",
      borderWidth: "0",
    },
  },
  defaultProps: {
    variant: "gray900",
  },
  variants: {
    gray900,
    transparent,
  },
});
