import { Flex, Heading, Text, VStack } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import type { ValidatorUptimeResponse } from "lib/services/types";

import { PenaltyEvent } from "./PenaltyEvent";

interface PenaltySectionProps {
  penaltyEvents: ValidatorUptimeResponse["events"];
}

export const PenaltySection = ({ penaltyEvents }: PenaltySectionProps) => (
  <Flex
    gap={4}
    p={{ base: 4, md: 6 }}
    w="100%"
    backgroundColor="gray.900"
    direction="column"
    rounded={8}
  >
    <Flex alignItems="center" gap={2}>
      <Heading as="h6" variant="h6" color="text.main">
        Jailed/Slashed
      </Heading>
      <Text variant="body2" color="text.dark">
        Latest 90 Days
      </Text>
    </Flex>
    {penaltyEvents.length === 0 ? (
      <Flex alignItems="center" gap={2}>
        <CustomIcon
          name="check-circle-solid"
          boxSize={5}
          color="success.main"
        />
        <Text variant="body2" color="text.dark">
          This validator never had any slash or jailed history within 90 days.
        </Text>
      </Flex>
    ) : (
      <VStack alignItems="flex-start" gap={2}>
        {penaltyEvents.map((event) => (
          <PenaltyEvent key={event.height} event={event} />
        ))}
      </VStack>
    )}
  </Flex>
);
