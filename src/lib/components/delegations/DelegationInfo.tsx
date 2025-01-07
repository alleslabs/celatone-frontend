import { Button, Flex, Heading } from "@chakra-ui/react";
import type { MouseEventHandler } from "react";

import { EmptyState } from "../state";
import { TableTitle } from "../table";
import { trackUseViewMore } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";

interface DelegationInfoProps {
  hasTotalBonded?: boolean;
  onClickToggle?: MouseEventHandler<HTMLButtonElement> | undefined;
  onViewMore?: () => void;
  otherInfoCards: JSX.Element;
  redelegationCount: number;
  totalBondedCard: JSX.Element;
}

export const DelegationInfo = ({
  hasTotalBonded = true,
  onClickToggle,
  onViewMore,
  otherInfoCards,
  redelegationCount,
  totalBondedCard,
}: DelegationInfoProps) => {
  const isMobile = useMobile();
  const isMobileOverview = isMobile && !!onViewMore;
  return (
    <>
      {isMobileOverview ? (
        <Flex
          bg="gray.900"
          justify="space-between"
          p={4}
          w="full"
          borderRadius="8px"
          onClick={() => {
            trackUseViewMore();
            onViewMore();
          }}
        >
          <Flex gap={2} direction="column">
            <Heading as="h6" variant="h6">
              Delegation Details
            </Heading>
            {totalBondedCard}
          </Flex>
          <CustomIcon name="chevron-right" color="gray.600" />
        </Flex>
      ) : (
        <Flex gap={4} mt={{ base: 4, md: 0 }} direction="column">
          <TableTitle mb={0} title="Delegations" showCount={false} />
          {hasTotalBonded ? (
            <Flex
              alignItems={{ base: "start", md: "center" }}
              justify="space-between"
              direction={{ base: "column", md: "row" }}
              overflowX="scroll"
              overflowY="hidden"
            >
              <Flex
                gap={{ base: 4, md: 8 }}
                w="full"
                direction={{ base: "column", md: "row" }}
              >
                {totalBondedCard}
                {otherInfoCards}
              </Flex>
              {onViewMore ? (
                <Button
                  minW="fit-content"
                  variant="ghost-gray"
                  onClick={() => {
                    trackUseViewMore();
                    onViewMore();
                  }}
                  rightIcon={<CustomIcon name="chevron-right" />}
                >
                  View Delegation Info
                </Button>
              ) : (
                <Flex
                  justify={{ base: "center", md: "inherit" }}
                  mt={{ base: 6, md: 0 }}
                  w={{ base: "full", md: "auto" }}
                >
                  <Button
                    isDisabled={!redelegationCount}
                    minW="fit-content"
                    variant="ghost-gray"
                    leftIcon={<CustomIcon name="history" />}
                    onClick={onClickToggle}
                    rightIcon={<CustomIcon name="chevron-right" />}
                  >
                    See Active Redelegations ({redelegationCount})
                  </Button>
                </Flex>
              )}
            </Flex>
          ) : (
            <EmptyState
              alignItems="flex-start"
              message="No assets were delegated to any validators."
              my={0}
              py={0}
            />
          )}
        </Flex>
      )}
    </>
  );
};
