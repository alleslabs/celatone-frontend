import { Flex } from "@chakra-ui/react";

import type { Delegation } from "../../data";
import { MobileLabel } from "../mobile/MobileLabel";
import { DelegationsTable } from "../tables";
import { TokenCell } from "../tables/TokenCell";
import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import type { Option, TokenWithValue } from "lib/types";

interface DelegationsTabProps {
  delegations: Option<Delegation[]>;
  rewards: Option<Record<string, TokenWithValue[]>>;
  defaultToken: TokenWithValue;
  isLoading: boolean;
}
export const DelegationsTab = ({
  delegations,
  rewards,
  defaultToken,
  isLoading,
}: DelegationsTabProps) => {
  const isMobile = useMobile();
  if (isLoading) return <Loading />;
  if (!delegations?.length)
    return (
      <EmptyState
        message="This account did not delegate their assets to any validators."
        withBorder
      />
    );

  return (
    <Flex w="full">
      {isMobile ? (
        <Flex direction="column" gap={4} w="full">
          {delegations.map((delegation) => (
            <Flex
              key={
                delegation.validator.validatorAddress +
                delegation.token.amount +
                delegation.token.denom
              }
              borderRadius="8px"
              background="gray.900"
              p={3}
              direction="column"
              gap={3}
              w="full"
            >
              <ValidatorBadge validator={delegation.validator} />
              <Flex
                direction="column"
                gap={3}
                borderTop="1px solid"
                borderTopColor="gray.700"
                pt={3}
              >
                <Flex direction="column" gap={1}>
                  <MobileLabel label="Amount" />
                  <TokenCell token={delegation.token} />
                </Flex>
                <Flex direction="column" gap={1}>
                  <MobileLabel label="Reward" />
                  <TokenCell
                    token={
                      rewards?.[delegation.validator.validatorAddress]?.find(
                        (token) => token.denom === defaultToken.denom
                      ) ?? defaultToken
                    }
                  />
                </Flex>
              </Flex>
            </Flex>
          ))}
        </Flex>
      ) : (
        <DelegationsTable
          delegations={delegations}
          rewards={rewards}
          defaultToken={defaultToken}
          isLoading={isLoading}
        />
      )}
    </Flex>
  );
};
