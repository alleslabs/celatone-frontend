import { Flex } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Loading } from "lib/components/Loading";
import type { ProposalDeposit } from "lib/types";

import { DepositAmounts } from "./DepositAmounts";

interface DepositListProps {
  isDepositsLoading: boolean;
  proposalDeposits: ProposalDeposit[];
}

export const DepositList = ({
  isDepositsLoading,
  proposalDeposits,
}: DepositListProps) => {
  const isMobile = useMobile();

  if (isDepositsLoading) return <Loading />;
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
            type="user_address"
            value={deposit.depositor}
            showCopyOnHover={!isMobile}
          />
          <DepositAmounts deposit={deposit} />
        </Flex>
      ))}
    </div>
  );
};
