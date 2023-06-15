import { Flex, Text } from "@chakra-ui/react";

import type { Option } from "lib/types";

interface CodeHashBoxProps {
  codeHash: Option<string>;
}

export const CodeHashBox = ({ codeHash }: CodeHashBoxProps) => (
  <Flex position="relative">
    <Text
      position="absolute"
      variant="body3"
      color="text.dark"
      px="1px"
      top="-10px"
      left={3}
    >
      Code Hash
    </Text>
    <Flex
      border="1px"
      borderRadius="5px"
      px={3}
      py={4}
      borderColor="gray.700"
      bg="gray.800"
      h="56px"
      w="full"
      overflowX="auto"
      overflowY="hidden"
    >
      <Text>{codeHash}</Text>
    </Flex>
  </Flex>
);
