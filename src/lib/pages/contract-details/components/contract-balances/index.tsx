import { Flex, Heading } from "@chakra-ui/react";
import { isUndefined } from "lodash";
import { useMemo } from "react";

import { UnsupportedTokensModal } from "lib/components/modal";
import type { ContractData } from "lib/pages/contract-details/types";
import type { ContractAddr } from "lib/types";

import { SupportedTokensSection } from "./SupportedTokensSection";

interface ContractBalancesProps {
  contractAddress: ContractAddr;
  balances: ContractData["balances"];
  isBalancesLoading: ContractData["isBalancesLoading"];
  amptrackPage?: string;
  onViewMore?: () => void;
}

export const ContractBalances = ({
  contractAddress,
  balances,
  isBalancesLoading,
  amptrackPage,
  onViewMore,
}: ContractBalancesProps) => {
  const supportedAssets = useMemo(
    () => balances?.filter((balance) => !isUndefined(balance.price)) ?? [],
    [balances]
  );
  const unsupportedAssets = useMemo(
    () =>
      balances
        ?.filter((balance) => isUndefined(balance.price))
        .map((balance) => ({
          denom: balance.denom,
          amount: balance.amount.toFixed(),
        })) ?? [],
    [balances]
  );

  return (
    <Flex
      flexDirection="column"
      pb={{ base: 2, md: 8 }}
      borderBottom={onViewMore ? { base: "none", md: "1px solid" } : "none"}
      borderBottomColor={{ base: "transparent", md: "gray.700" }}
      gap={4}
    >
      <Flex justify="space-between" align="center" mb={{ base: 2, md: 1 }}>
        <Heading as="h6" variant="h6" color="text.main" fontWeight={500}>
          Assets
        </Heading>
        <UnsupportedTokensModal
          unsupportedAssets={unsupportedAssets}
          address={contractAddress}
          addressType="contract_address"
          amptrackSection={amptrackPage}
        />
      </Flex>
      <SupportedTokensSection
        total={balances?.length}
        isBalancesLoading={isBalancesLoading}
        supportedAssets={supportedAssets}
      />
    </Flex>
  );
};
