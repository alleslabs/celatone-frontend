import { Button, Flex, Heading } from "@chakra-ui/react";
import type { MouseEventHandler } from "react";

import { trackUseViewMore } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { EmptyState } from "../state";
import { TableTitle } from "../table";

interface DelegationInfoProps {
  totalBondedCard: JSX.Element;
  otherInfoCards: JSX.Element;
  redelegationCount: number;
  onClickToggle?: MouseEventHandler<HTMLButtonElement> | undefined;
  onViewMore?: () => void;
  hasTotalBonded?: boolean;
}

export const DelegationInfo = ({
  totalBondedCard,
  otherInfoCards,
  redelegationCount,
  onClickToggle,
  onViewMore,
  hasTotalBonded = true,
}: DelegationInfoProps) => {
  const isMobile = useMobile();
  const isMobileOverview = isMobile && !!onViewMore;
  return (
    <>
      {isMobileOverview ? (
        <Flex
          justify="space-between"
          w="full"
          bg="gray.900"
          borderRadius="8px"
          p={4}
          onClick={() => {
            trackUseViewMore();
            onViewMore();
          }}
        >
          <Flex direction="column" gap={2}>
            <Heading variant="h6" as="h6">
              Delegation details
            </Heading>
            {totalBondedCard}
          </Flex>
          <CustomIcon name="chevron-right" color="gray.600" />
        </Flex>
      ) : (
        <Flex direction="column" gap={4} mt={{ base: 4, md: 0 }}>
          <TableTitle title="Delegations" mb={0} showCount={false} />
          {hasTotalBonded ? (
            <Flex
              direction={{ base: "column", md: "row" }}
              alignItems={{ base: "start", md: "center" }}
              justify="space-between"
              overflowX="scroll"
              overflowY="hidden"
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
                    trackUseViewMore();
                    onViewMore();
                  }}
                >
                  View delegation info
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
