import { Flex } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TokenComposition, TokenImageRender } from "lib/components/token";
import type { ProposalDeposit } from "lib/types";

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
                <TokenComposition
                  token={token}
                  decimal={2}
                  displayValue={false}
                />
                <TokenImageRender logo={token.logo} />
              </Flex>
            ))}
          </div>
        </Flex>
      ))}
    </div>
  );
};
