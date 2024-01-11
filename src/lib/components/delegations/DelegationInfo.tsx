import { Button, Flex, Heading } from "@chakra-ui/react";
import type { MouseEventHandler } from "react";

import { TableTitle } from "../table";
import { AmpEvent, track } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";

interface DelegationInfoProps {
  totalBondedCard: JSX.Element;
  otherInfoCards: JSX.Element;
  redelegationCount: number;
  onClickToggle?: MouseEventHandler<HTMLButtonElement> | undefined;
  onViewMore?: () => void;
}

export const DelegationInfo = ({
  totalBondedCard,
  otherInfoCards,
  redelegationCount,
  onClickToggle,
  onViewMore,
}: DelegationInfoProps) => {
  const isMobile = useMobile();
  const isMobileOverview = isMobile && !!onViewMore;
  const tableTitle = (
    <TableTitle title="Delegations" mb={0} showCount={false} />
  );

  return (
    <>
      {isMobileOverview ? (
        <Flex
          justify="space-between"
          w="full"
          bg="gray.900"
          borderRadius="8px"
          p={4}
          onClick={onViewMore}
        >
          <Flex direction="column" gap={2}>
            <Heading variant="h6" as="h6">
              Delegation Details
            </Heading>
            {totalBondedCard}
          </Flex>
          <CustomIcon name="chevron-right" color="gray.600" />
        </Flex>
      ) : (
        <Flex direction="column" gap={4} mt={{ base: 4, md: 0 }}>
          {tableTitle}
          <Flex
            direction={{ base: "column", md: "row" }}
            alignItems={{ base: "start", md: "center" }}
            justify="space-between"
            overflowX="scroll"
          >
            <Flex
              gap={{ base: 4, md: 8 }}
              direction={{ base: "column", md: "row" }}
              w="full"
            >
              {totalBondedCard}
              {otherInfoCards}
            </Flex>
            {onViewMore ? (
              <Button
                variant="ghost-gray"
                minW="fit-content"
                rightIcon={<CustomIcon name="chevron-right" />}
                onClick={() => {
                  track(AmpEvent.USE_VIEW_MORE);
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
        </Flex>
      )}
    </>
  );
};
