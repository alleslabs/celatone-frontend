import { chakra, Flex } from "@chakra-ui/react";

export const ModuleContainer = chakra(Flex, {
  baseStyle: {
    flexDirection: "column",
    bgColor: "gray.900",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    gap: 4,
    px: 4,
  },
});
