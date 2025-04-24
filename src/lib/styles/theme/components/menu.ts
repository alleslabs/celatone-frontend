import { menuAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(menuAnatomy.keys);

const baseStyle = definePartsStyle({
  divider: {
    borderColor: "gray.700",
  },
  item: {
    _focus: {
      bg: "gray.800",
    },
    _hover: {
      bg: "gray.800",
    },
    bg: "gray.900",
    color: "text.main",
    fontSize: "14px",
  },
  list: {
    bg: "gray.900",
    border: "none",
    borderRadius: "8px",
    py: "2",
  },
});

export const Menu = defineMultiStyleConfig({ baseStyle });
