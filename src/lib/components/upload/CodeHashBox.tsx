import type { Option } from "lib/types";

import { Box, Text } from "@chakra-ui/react";

interface CodeHashBoxProps {
  codeHash: Option<string>;
}

export const CodeHashBox = ({ codeHash }: CodeHashBoxProps) => (
  <Box position="relative">
    <Text
      color="text.dark"
      left={3}
      position="absolute"
      px="1px"
      top="-10px"
      variant="body3"
    >
      Code Hash
    </Text>
    <Box
      bg="gray.800"
      border="1px"
      borderColor="gray.700"
      borderRadius="5px"
      h="56px"
      overflowX="auto"
      overflowY="hidden"
      px={3}
      py={4}
      w="full"
    >
      <Text whiteSpace="nowrap">{codeHash}</Text>
    </Box>
  </Box>
);
