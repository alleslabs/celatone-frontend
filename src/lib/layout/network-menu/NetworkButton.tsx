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
      _hover={{ bg: "gray.900", cursor: "pointer" }}
      alignItems="center"
      borderColor={isMobile ? "gray.700" : "transparent"}
      borderRadius={isMobile ? "8px" : 0}
      borderWidth={isMobile ? "1px" : 0}
      h="full"
      justifyContent="space-between"
      px={4}
      py={2}
      transition="all 0.25s ease-in-out"
      w={width}
      onClick={onClick}
    >
      <Text
        maxW={width}
        overflow="hidden"
        textOverflow="ellipsis"
        variant="body2"
        whiteSpace="nowrap"
      >
        {currentChainId}
      </Text>
      <CustomIcon color="gray.600" name="chevron-down" />
    </Flex>
  );
};
