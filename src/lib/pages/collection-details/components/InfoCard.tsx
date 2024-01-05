import { Box, Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

const InfoCard = ({
  title,
  content,
  onClick,
  isDisabled,
}: {
  title: string;
  content: number;
  onClick: () => void;
  isDisabled: boolean;
}) => {
  return (
    <Flex
      p="16px"
      borderRadius="8px"
      bg="gray.800"
      justify="space-between"
      align="center"
      flex={1}
      onClick={isDisabled ? undefined : onClick}
      cursor={isDisabled ? "not-allowed" : "pointer"}
    >
      <Box fontWeight={600}>
        <Text fontSize="14px" color="gray.400">
          {title}
        </Text>
        <Text fontSize="24px" color={isDisabled ? "gray.600" : undefined}>
          {content}
        </Text>
      </Box>
      <CustomIcon
        name="chevron-right"
        boxSize="20px"
        color={isDisabled ? "gray.600" : undefined}
      />
    </Flex>
  );
};

export default InfoCard;
