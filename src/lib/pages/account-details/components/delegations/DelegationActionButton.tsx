import { Button, Flex } from "@chakra-ui/react";
import type { MouseEventHandler } from "react";

import { CustomIcon } from "lib/components/icon";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

interface DelegationActionButtonProps {
  onViewMore?: () => void;
  redelegationCount: number;
  onClickToggle?: MouseEventHandler<HTMLButtonElement> | undefined;
}
export const DelegationActionButton = ({
  onViewMore,
  onClickToggle,
  redelegationCount,
}: DelegationActionButtonProps) => {
  return (
    <>
      {onViewMore ? (
        <Button
          variant="ghost-gray"
          minW="fit-content"
          rightIcon={<CustomIcon name="chevron-right" />}
          onClick={() => {
            AmpTrack(AmpEvent.USE_VIEW_MORE);
            onViewMore();
          }}
        >
          View Delegation Info
        </Button>
      ) : (
        <Flex
          w={{ base: "full", md: "auto" }}
          justify={{ base: "center", md: "inherit" }}
          mt={{ base: 6, md: 0 }}
        >
          <Button
            variant="ghost-gray"
            minW="fit-content"
            leftIcon={<CustomIcon name="history" />}
            rightIcon={<CustomIcon name="chevron-right" />}
            isDisabled={!redelegationCount}
            onClick={onClickToggle}
          >
            See Active Redelegations ({redelegationCount})
          </Button>
        </Flex>
      )}
    </>
  );
};
