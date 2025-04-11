import type { ValidatorUptimeResponse } from "lib/services/types";

import { Flex, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { SlashingEvent } from "lib/types";
import { useMemo } from "react";

interface PenaltyEventProps {
  event: ValidatorUptimeResponse["events"][0];
}
export const PenaltyEvent = ({ event }: PenaltyEventProps) => {
  const { icon, color } = useMemo(() => {
    switch (event.type) {
      case SlashingEvent.Slashed:
        return { icon: "slashed" as const, color: "error.main" };
      case SlashingEvent.Jailed:
        return { icon: "jailed" as const, color: "error.main" };
      case SlashingEvent.Unjailed:
        return { icon: "unjailed" as const, color: "success.main" };
      default:
        return { icon: "info-circle" as const, color: "primary.main" };
    }
  }, [event.type]);

  return (
    <Flex alignItems="center" gap={2}>
      <Flex alignItems="center" gap={1}>
        <CustomIcon boxSize={5} color={color} name={icon} />
        <Text color="text.main" variant="body2">
          <span style={{ fontWeight: 700 }}>{event.type}</span> at block height
        </Text>
        <ExplorerLink
          showCopyOnHover
          type="block_height"
          value={event.height.toString()}
        />
      </Flex>
    </Flex>
  );
};
