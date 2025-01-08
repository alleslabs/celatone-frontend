import { Flex, Text } from "@chakra-ui/react";
import { useMemo } from "react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import type { ValidatorUptimeResponse } from "lib/services/types";
import { SlashingEvent } from "lib/types";

interface PenaltyEventProps {
  event: ValidatorUptimeResponse["events"][0];
}
export const PenaltyEvent = ({ event }: PenaltyEventProps) => {
  const { color, icon } = useMemo(() => {
    switch (event.type) {
      case SlashingEvent.Jailed:
        return { color: "error.main", icon: "jailed" as const };
      case SlashingEvent.Slashed:
        return { color: "error.main", icon: "slashed" as const };
      case SlashingEvent.Unjailed:
        return { color: "success.main", icon: "unjailed" as const };
      default:
        return { color: "primary.main", icon: "info-circle" as const };
    }
  }, [event.type]);

  return (
    <Flex alignItems="center" gap={2}>
      <Flex alignItems="center" gap={1}>
        <CustomIcon name={icon} boxSize={5} color={color} />
        <Text variant="body2" color="text.main">
          <span style={{ fontWeight: 700 }}>{event.type}</span> at block height
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
