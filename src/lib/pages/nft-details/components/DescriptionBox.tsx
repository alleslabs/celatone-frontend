import type { Option } from "lib/types";

import { Box, Text } from "@chakra-ui/react";

interface DescriptionBoxProps {
  description: Option<string>;
}

export const DescriptionBox = ({ description }: DescriptionBoxProps) => (
  <Box backgroundColor="gray.900" borderRadius="8px" fontSize="14px" p="16px">
    <Text fontWeight={700} mb="8px">
      Description
    </Text>
    {description ? (
      <Text>{description}</Text>
    ) : (
      <Text color="text.dark">No description was provided by the creator.</Text>
    )}
  </Box>
);
