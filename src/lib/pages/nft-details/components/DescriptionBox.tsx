import { Box, Text } from "@chakra-ui/react";

import type { Option } from "lib/types";

interface DescriptionBoxProps {
  description: Option<string>;
}

export const DescriptionBox = ({ description }: DescriptionBoxProps) => (
  <Box fontSize="14px" p="16px" borderRadius="8px" backgroundColor="gray.900">
    <Text mb="8px" fontWeight={700}>
      Description
    </Text>
    {description ? (
      <Text>{description}</Text>
    ) : (
      <Text color="text.dark">No description was provided by the creator.</Text>
    )}
  </Box>
);
