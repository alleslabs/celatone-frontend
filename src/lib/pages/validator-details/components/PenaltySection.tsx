import { Flex, Heading, Text } from "@chakra-ui/react";

import { PenaltyStatus } from "../types";

import { PenaltyStatusSection } from "./PenaltyStatusSection";

export const PenaltySection = () => (
  <Flex
    direction="column"
    gap={4}
    backgroundColor="gray.900"
    p={{ base: 4, md: 6 }}
    rounded={8}
    w="100%"
  >
    <Flex alignItems="center" gap={2}>
      <Heading variant="h6" as="h6" color="text.main">
        Jailed/Slashed
      </Heading>
      <Text variant="body2" color="text.dark">
        Latest 90 Days
      </Text>
    </Flex>
    <Flex direction="column" gap={2}>
      <PenaltyStatusSection status={PenaltyStatus.JAILED} />
      <PenaltyStatusSection status={PenaltyStatus.SLASHED} />
      <PenaltyStatusSection status={PenaltyStatus.JAILED} />
    </Flex>
  </Flex>
);
