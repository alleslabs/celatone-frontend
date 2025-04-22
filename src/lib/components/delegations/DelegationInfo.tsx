import type { MouseEventHandler } from "react";

import { Button, Flex, Heading } from "@chakra-ui/react";
import { trackUseViewMore } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";

import { EmptyState } from "../state";
import { TableTitle } from "../table";

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
          borderRadius="8px"
          justify="space-between"
          p={4}
          w="full"
          onClick={() => {
            trackUseViewMore();
            onViewMore();
          }}
        >
          <Flex direction="column" gap={2}>
            <Heading as="h6" variant="h6">
              Delegation details
            </Heading>
            {totalBondedCard}
          </Flex>
          <CustomIcon color="gray.600" name="chevron-right" />
        </Flex>
      ) : (
        <Flex direction="column" gap={4} mt={{ base: 4, md: 0 }}>
          <TableTitle mb={0} showCount={false} title="Delegations" />
          {hasTotalBonded ? (
            <Flex
              alignItems={{ base: "start", md: "center" }}
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              overflowX="scroll"
              overflowY="hidden"
            >
              <Flex
                direction={{ base: "column", md: "row" }}
                gap={{ base: 4, md: 8 }}
                w="full"
              >
                {totalBondedCard}
                {otherInfoCards}
              </Flex>
              {onViewMore ? (
                <Button
                  minW="fit-content"
                  rightIcon={<CustomIcon name="chevron-right" />}
                  variant="ghost-gray"
                  onClick={() => {
                    trackUseViewMore();
                    onViewMore();
                  }}
                >
                  View delegation info
                </Button>
              ) : (
                <Flex
                  justify={{ base: "center", md: "inherit" }}
                  mt={{ base: 6, md: 0 }}
                  w={{ base: "full", md: "auto" }}
                >
                  <Button
                    isDisabled={!redelegationCount}
                    leftIcon={<CustomIcon name="history" />}
                    minW="fit-content"
                    rightIcon={<CustomIcon name="chevron-right" />}
                    variant="ghost-gray"
                    onClick={onClickToggle}
                  >
                    See active redelegations ({redelegationCount})
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
