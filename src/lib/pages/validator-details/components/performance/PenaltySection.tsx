import type { ValidatorUptimeResponse } from "lib/services/types";

import { Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";

import { PenaltyEvent } from "./PenaltyEvent";

interface PenaltySectionProps {
  penaltyEvents: ValidatorUptimeResponse["events"];
}

export const PenaltySection = ({ penaltyEvents }: PenaltySectionProps) => (
  <Flex
    backgroundColor="gray.900"
    direction="column"
    gap={4}
    p={{ base: 4, md: 6 }}
    rounded={8}
    w="100%"
  >
    <Flex alignItems="center" gap={2}>
      <Heading as="h6" color="text.main" variant="h6">
        Jailed/Slashed
      </Heading>
      <Text color="text.dark" variant="body2">
        Latest 90 Days
      </Text>
    </Flex>
    {penaltyEvents.length === 0 ? (
      <Flex alignItems="center" gap={2}>
        <CustomIcon
          boxSize={5}
          color="success.main"
          name="check-circle-solid"
        />
        <Text color="text.dark" variant="body2">
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
