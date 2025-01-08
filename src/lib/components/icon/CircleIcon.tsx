import { Flex } from "@chakra-ui/react";

export interface CircleIconProps {
  color?: string;
}

export const CircleIcon = ({ color }: CircleIconProps) => (
  <Flex
    h="14px"
    minH="14px"
    minW="14px"
    w="14px"
    backgroundColor={color}
    borderRadius="100%"
  />
);
