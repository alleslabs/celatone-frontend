import { Flex, Text } from "@chakra-ui/react";
import { useMemo } from "react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import type { ValidatorUptimeResponse } from "lib/services/validator";
import { SlashingEvent } from "lib/types";

interface PenaltyEventProps {
  event: ValidatorUptimeResponse["events"][0];
}
export const PenaltyEvent = ({ event }: PenaltyEventProps) => {
  const { icon, color } = useMemo(() => {
    switch (event.type) {
      case SlashingEvent.Slashed:
        return { icon: "alert-triangle" as const, color: "error.main" };
      case SlashingEvent.Jailed:
        return { icon: "alert-triangle" as const, color: "warning.main" };
      default:
        return { icon: "info-circle" as const, color: "secondary.main" };
    }
  }, [event.type]);

  return (
    <Flex alignItems="center" gap={2}>
      <Flex alignItems="center" gap={1}>
        <CustomIcon name={icon} color={color} />
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
};
