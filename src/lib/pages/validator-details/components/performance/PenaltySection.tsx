import { Flex, Heading, Text } from "@chakra-ui/react";

import type { ValidatorUptimeResponse } from "lib/services/validator";

import { PenaltyEvent } from "./PenaltyEvent";

interface PenaltySectionProps {
  penaltyEvents: ValidatorUptimeResponse["events"];
}

export const PenaltySection = ({ penaltyEvents }: PenaltySectionProps) => (
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
      {penaltyEvents.length === 0 ? (
        <Text variant="body2" color="text.dark">
          This validator never had any slash or jailed history within 90 days.
        </Text>
      ) : (
        penaltyEvents.map((event) => (
          <PenaltyEvent key={event.height} event={event} />
        ))
      )}
    </Flex>
  </Flex>
);
