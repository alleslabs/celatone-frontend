import { Flex, Heading } from "@chakra-ui/react";

import { UnsupportedTokensModal } from "lib/components/modal";
import type { ContractData } from "lib/pages/contract-details/types";
import type { ContractAddr } from "lib/types";
import { filterSupportedTokens } from "lib/utils";

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
  const {
    supportedTokens: supportedAssets,
    unsupportedTokens: unsupportedAssets,
  } = filterSupportedTokens(balances);

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
