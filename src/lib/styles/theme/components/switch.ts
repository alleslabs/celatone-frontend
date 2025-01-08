import { switchAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(switchAnatomy.keys);

const baseStyle = definePartsStyle({
  track: {
    bg: "gray.500",
    _checked: {
      bg: "primary.main",
    },
  },
});

export const Switch = defineMultiStyleConfig({
  baseStyle,
});
