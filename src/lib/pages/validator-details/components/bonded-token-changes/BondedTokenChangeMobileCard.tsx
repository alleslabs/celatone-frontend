import { Flex, Heading, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

export const BondedTokenChangeMobileCard = ({
  denom,
  onViewMore,
}: {
  denom: string;
  onViewMore: () => void;
}) => (
  <Flex
    backgroundColor="gray.900"
    p={4}
    rounded={8}
    w="100%"
    justifyContent="space-between"
    alignItems="center"
    onClick={onViewMore}
  >
    <Flex direction="column" gap={2}>
      <Heading as="h6" variant="h6">
        Bonded Token Changes
      </Heading>
      <Flex alignItems="center" gap={2}>
        <CustomIcon name="chevron-up" boxSize={6} color="success.main" />
        <Heading as="h5" variant="h5">
          7.21%
        </Heading>
      </Flex>
      <Text variant="body1">
        <Text as="span" fontWeight={700}>
          +24.02
        </Text>{" "}
        {denom} in last 24 hr
      </Text>
    </Flex>
    <CustomIcon name="chevron-right" color="gray.600" />
  </Flex>
);
