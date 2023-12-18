import { Box, Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

const InfoCard = ({ title, content }: { title: string; content: number }) => {
  return (
    <Flex
      p="16px"
      borderRadius="8px"
      bg="gray.800"
      justify="space-between"
      align="center"
      flex={1}
    >
      <Box fontWeight={600}>
        <Text fontSize="14px" color="gray.400">
          {title}
        </Text>
        <Text fontSize="24px">{content}</Text>
      </Box>
      <CustomIcon name="chevron-right" boxSize="20px" />
    </Flex>
  );
};

export default InfoCard;
