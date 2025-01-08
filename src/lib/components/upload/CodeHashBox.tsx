import { Box, Text } from "@chakra-ui/react";

import type { Option } from "lib/types";

interface CodeHashBoxProps {
  codeHash: Option<string>;
}

export const CodeHashBox = ({ codeHash }: CodeHashBoxProps) => (
  <Box position="relative">
    <Text
      left={3}
      px="1px"
      variant="body3"
      color="text.dark"
      position="absolute"
      top="-10px"
    >
      Code Hash
    </Text>
    <Box
      bg="gray.800"
      h="56px"
      px={3}
      py={4}
      w="full"
      border="1px"
      borderColor="gray.700"
      borderRadius="5px"
      overflowX="auto"
      overflowY="hidden"
    >
      <Text whiteSpace="nowrap">{codeHash}</Text>
    </Box>
  </Box>
);
