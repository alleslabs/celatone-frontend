import { Button, Flex, Heading } from "@chakra-ui/react";
import type { MouseEventHandler, ReactNode } from "react";

import { MobileDelegationTitle } from "../mobile/MobileDelegationTitle";
import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

interface DelegationInfoProps {
  onViewMore?: () => void;
  infoCards: ReactNode;
  redelegationCount: number;
  onClickToggle?: MouseEventHandler<HTMLButtonElement> | undefined;
  TotalBondedCard: JSX.Element;
}
const DelegationsTitle = ({
  onViewMore,
  TotalBondedCard,
}: {
  onViewMore?: () => void;
  TotalBondedCard: JSX.Element;
}) => {
  const isMobile = useMobile();
  if (!isMobile && !onViewMore) return null;
  if (isMobile && onViewMore)
    return (
      <MobileDelegationTitle onViewMore={onViewMore}>
        {TotalBondedCard}
      </MobileDelegationTitle>
    );
  return (
    <Heading
      variant="h6"
      as="h6"
      display="flex"
      alignItems="center"
      height={{ base: "29px", md: "auto" }}
    >
      Delegations
    </Heading>
  );
};
export const DelegationInfo = ({
  onViewMore,
  onClickToggle,
  redelegationCount,
  infoCards,
  TotalBondedCard,
}: DelegationInfoProps) => {
  const isMobile = useMobile();
  let isMobileDetail = null;
  if (isMobile && onViewMore) {
    isMobileDetail = false;
  } else {
    isMobileDetail = true;
  }
  return (
    <>
      <DelegationsTitle
        onViewMore={onViewMore}
        TotalBondedCard={TotalBondedCard}
      />
      {isMobileDetail && (
        <Flex
          direction={{ base: "column", md: "row" }}
          alignItems={{ base: "start", md: "center" }}
          justify="space-between"
          overflowX="scroll"
        >
          <Flex gap={8} direction={{ base: "column", md: "row" }}>
            {infoCards}
          </Flex>
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
        </Flex>
      )}
    </>
  );
};
