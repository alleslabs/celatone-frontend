import { menuAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys);

const baseStyle = definePartsStyle({
  list: {
    py: "2",
    borderRadius: "8px",
    border: "none",
    bg: "pebble.900",
  },
  item: {
    color: "text.main",
    _hover: {
      bg: "pebble.800",
    },
    _focus: {
      bg: "pebble.800",
    },
    fontSize: "14px",
  },
  divider: {
    borderColor: "pebble.700",
  },
});

export const Menu = defineMultiStyleConfig({ baseStyle });
