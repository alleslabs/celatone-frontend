import { Flex, Text } from "@chakra-ui/react";

import { useCelatoneApp } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";

interface NetworkButtonProps {
  isMobile: boolean;
  onClick: () => void;
}

export const NetworkButton = ({ isMobile, onClick }: NetworkButtonProps) => {
  const { currentChainId } = useCelatoneApp();
  const width = isMobile ? "220px" : "170px";
  return (
    <Flex
      borderWidth={isMobile ? "1px" : 0}
      alignItems="center"
      h="full"
      px={4}
      py={2}
      w={width}
      _hover={{ bg: "gray.900", cursor: "pointer" }}
      borderColor={isMobile ? "gray.700" : "transparent"}
      borderRadius={isMobile ? "8px" : 0}
      justifyContent="space-between"
      onClick={onClick}
      transition="all 0.25s ease-in-out"
    >
      <Text
        maxW={width}
        variant="body2"
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
      >
        {currentChainId}
      </Text>
      <CustomIcon name="chevron-down" color="gray.600" />
    </Flex>
  );
};
