import { Flex, Text } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TokenImageRender } from "lib/components/token";
import type { ProposalDeposit } from "lib/types";
import { formatUTokenWithPrecision, getTokenLabel } from "lib/utils";

interface DepositListProps {
  proposalDeposits: ProposalDeposit[];
}

export const DepositList = ({ proposalDeposits }: DepositListProps) => {
  const isMobile = useMobile();

  return (
    <div>
      {proposalDeposits.map((deposit) => (
        <Flex
          justify="space-between"
          py="10px"
          borderY="1px solid var(--chakra-colors-gray-700)"
        >
          <ExplorerLink
            value={deposit.depositor}
            type="user_address"
            showCopyOnHover={!isMobile}
          />
          <div>
            {deposit.amount.map((token) => (
              <Flex key={token.denom} alignItems="center" gap={2}>
                <Text variant="body2">
                  <Text as="span" fontWeight={700} mr={1}>
                    {formatUTokenWithPrecision(
                      token.amount,
                      token.precision ?? 0,
                      true,
                      2
                    )}
                  </Text>
                  {getTokenLabel(token.denom, token.symbol)}
                </Text>
                <TokenImageRender logo={token.logo} />
              </Flex>
            ))}
          </div>
        </Flex>
      ))}
    </div>
  );
};
