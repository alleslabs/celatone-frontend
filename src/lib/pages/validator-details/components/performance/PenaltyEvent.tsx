import { Flex, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import type { ValidatorUptimeResponse } from "lib/services/validator";
import { SlashingEvent } from "lib/types";

interface PenaltyEventProps {
  event: ValidatorUptimeResponse["events"][0];
}
export const PenaltyEvent = ({ event }: PenaltyEventProps) => (
  <Flex alignItems="center" gap={2}>
    <Flex alignItems="center" gap={1}>
      <CustomIcon
        name="alert-triangle"
        color={
          event.type === SlashingEvent.Jailed ? "warning.main" : "error.main"
        }
      />
      <Text variant="body2" color="text.main">
        {event.type} at block height
      </Text>
      <ExplorerLink
        type="block_height"
        value={event.height.toString()}
        showCopyOnHover
      />
    </Flex>
  </Flex>
);
