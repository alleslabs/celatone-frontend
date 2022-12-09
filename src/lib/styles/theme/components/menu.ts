import { menuAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys);

const baseStyle = definePartsStyle({
  list: {
    py: "2",
    borderRadius: "base",
    border: "none",
    bg: "gray.900",
  },
  item: {
    color: "gray.200",
    _hover: {
      bg: "gray.800",
    },
    _focus: {
      bg: "gray.800",
    },
  },
  divider: {
    borderColor: "rgba(255,255,255,0.12)",
  },
});

export const Menu = defineMultiStyleConfig({ baseStyle });
