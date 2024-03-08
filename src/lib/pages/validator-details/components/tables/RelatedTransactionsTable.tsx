import { Flex, Heading, Text } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";

export const RelatedTransactionTable = () => {
  const isMobile = useMobile();
  return isMobile ? (
    <Flex>mobile table</Flex>
  ) : (
    <Flex direction="column">
      <Heading as="h6" variant="h6">
        Delegation-Related Transactions
      </Heading>
      <Text variant="body2" color="text.dark" fontWeight="500" mb={8} mt={1}>
        Shows transactions relevant to changes in delegated tokens, excluding
        any token reduction due to slashing.
      </Text>
      <Flex> table</Flex>
    </Flex>
  );
};
