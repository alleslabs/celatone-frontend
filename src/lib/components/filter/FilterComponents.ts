import { chakra, List } from "@chakra-ui/react";

export const DropdownContainer = chakra(List, {
  baseStyle: {
    borderRadius: "8px",
    bg: "gray.900",
    px: 2,
    py: 1,
    mt: 0,
    position: "absolute",
    zIndex: 2,
    w: "full",
    top: "60px",
    overflowY: "auto",
  },
});
