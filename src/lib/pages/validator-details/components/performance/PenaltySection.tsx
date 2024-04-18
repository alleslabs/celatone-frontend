import { Flex, Heading, Text, VStack } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
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
    {penaltyEvents.length === 0 ? (
      <Flex gap={2} alignItems="center">
        <CustomIcon name="check-circle" color="success.main" boxSize={5} />
        <Text variant="body2" color="text.dark">
          This validator never had any slash or jailed history within 90 days.
        </Text>
      </Flex>
    ) : (
      <VStack gap={2} alignItems="flex-start">
        {penaltyEvents.map((event) => (
          <PenaltyEvent key={event.height} event={event} />
        ))}
      </VStack>
    )}
  </Flex>
);
