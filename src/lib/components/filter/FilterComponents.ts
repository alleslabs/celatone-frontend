import { chakra, List } from "@chakra-ui/react";

export const DropdownContainer = chakra(List, {
  baseStyle: {
    bg: "gray.900",
    borderRadius: "8px",
    boxShadow: "0px 8px 8px 0px var(--chakra-colors-background-main)",
    mt: 0,
    overflowY: "auto",
    position: "absolute",
    px: 2,
    py: 1,
    top: "60px",
    w: "full",
    zIndex: 2,
  },
});
