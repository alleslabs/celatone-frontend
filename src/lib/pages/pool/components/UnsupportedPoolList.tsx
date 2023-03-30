import { Badge, Button, Flex, Heading, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

export const UnsupportedPoolList = () => {
  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Flex gap={2} h="29px" alignItems="center">
        <Heading as="h6" variant="h6">
          Pools with unsupported tokens
        </Heading>
        <Badge variant="gray" color="text.main" textColor="text.main">
          12
        </Badge>
      </Flex>
      <Flex gap={4}>
        <Flex gap="2" alignItems="center">
          <Text variant="body2" color="text.dark">
            Sort Pool ID:
          </Text>
          <Button variant="outline-gray" size="sm" pr="1">
            Newest First
            <CustomIcon name="arrow-down" color="text.dark" />
          </Button>
        </Flex>
        <Flex gap="2" alignItems="center">
          <Button variant="outline-gray" size="sm" pr="1">
            Expand All
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
