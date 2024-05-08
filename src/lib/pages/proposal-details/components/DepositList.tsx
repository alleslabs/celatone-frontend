import { Flex } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { ProposalDeposit } from "lib/types";

import { DepositAmounts } from "./DepositAmounts";

interface DepositListProps {
  proposalDeposits: ProposalDeposit[];
}

export const DepositList = ({ proposalDeposits }: DepositListProps) => {
  const isMobile = useMobile();

  return (
    <div>
      {proposalDeposits.map((deposit, index) => (
        <Flex
          key={deposit.depositor + index.toString()}
          justify="space-between"
          py="10px"
          borderY="1px solid var(--chakra-colors-gray-700)"
        >
          <ExplorerLink
            value={deposit.depositor}
            type="user_address"
            showCopyOnHover={!isMobile}
          />
          <DepositAmounts deposit={deposit} />
        </Flex>
      ))}
    </div>
  );
};
