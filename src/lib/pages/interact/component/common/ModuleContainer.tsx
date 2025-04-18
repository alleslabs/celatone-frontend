import { chakra, Flex } from "@chakra-ui/react";

export const ModuleContainer = chakra(Flex, {
  baseStyle: {
    alignItems: "center",
    bgColor: "gray.900",
    borderRadius: 8,
    flexDirection: "column",
    gap: 4,
    justifyContent: "center",
    px: 4,
  },
});
