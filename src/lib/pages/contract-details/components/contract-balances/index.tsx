import { Flex, Heading } from "@chakra-ui/react";

import { UnsupportedTokensModal } from "lib/components/modal";
import { ErrorFetching } from "lib/components/state/ErrorFetching";
import { useBalanceInfos } from "lib/services/balanceService";
import type { BechAddr32 } from "lib/types";

import { SupportedTokensSection } from "./SupportedTokensSection";

interface ContractBalancesProps {
  contractAddress: BechAddr32;
  amptrackPage?: string;
  onViewMore?: () => void;
}

export const ContractBalances = ({
  contractAddress,
  amptrackPage,
  onViewMore,
}: ContractBalancesProps) => {
  const { supportedAssets, unsupportedAssets, isLoading, totalData, error } =
    useBalanceInfos(contractAddress);

  if (error) return <ErrorFetching dataName="balances" />;

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
        total={totalData}
        isBalancesLoading={isLoading}
        supportedAssets={supportedAssets}
      />
    </Flex>
  );
};
