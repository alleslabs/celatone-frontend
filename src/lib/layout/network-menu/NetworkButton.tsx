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
      alignItems="center"
      justifyContent="space-between"
      px={4}
      py={2}
      h="full"
      _hover={{ bg: "gray.900", cursor: "pointer" }}
      transition="all 0.25s ease-in-out"
      w={width}
      borderRadius={isMobile ? "8px" : 0}
      borderWidth={isMobile ? "1px" : 0}
      borderColor={isMobile ? "gray.700" : "transparent"}
      onClick={onClick}
    >
      <Text
        textOverflow="ellipsis"
        variant="body2"
        overflow="hidden"
        whiteSpace="nowrap"
        maxW={width}
      >
        {currentChainId}
      </Text>
      <CustomIcon name="chevron-down" color="gray.600" />
    </Flex>
  );
};
