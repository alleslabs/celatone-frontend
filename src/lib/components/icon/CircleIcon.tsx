import { Flex } from "@chakra-ui/react";

export interface CircleIconProps {
  color?: string;
}

export const CircleIcon = ({ color }: CircleIconProps) => (
  <Flex
    w="14px"
    h="14px"
    minW="14px"
    minH="14px"
    backgroundColor={color}
    borderRadius="100%"
  />
);
