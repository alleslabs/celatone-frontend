import { Flex } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { InstantiatedContractCard } from "lib/components/card/ContractCard";
import { Loading } from "lib/components/Loading";
import { ContractsTable } from "lib/components/table";
import type { ContractAddr, Option, ContractInfo } from "lib/types";

interface ContractsBodyProps {
  contracts: Option<ContractInfo[]>;
  isLoading: boolean;
  emptyState: JSX.Element;
  onRowSelect: (contract: ContractAddr) => void;
  onViewMore?: () => void;
}

export const ContractsBody = ({
  contracts,
  isLoading,
  emptyState,
  onRowSelect,
  onViewMore,
}: ContractsBodyProps) => {
  const isMobile = useMobile();
  if (isLoading) return <Loading />;
  if (!contracts?.length) return emptyState;
  if (isMobile && !onViewMore)
    return (
      <Flex direction="column" gap={4} w="full" mt={4}>
        {contracts.map((contractInfo) => (
          <InstantiatedContractCard
            contractInfo={contractInfo}
            key={
              contractInfo.name +
              contractInfo.contractAddress +
              contractInfo.description +
              contractInfo.tags +
              contractInfo.lists
            }
          />
        ))}
      </Flex>
    );
  if (isMobile && onViewMore) return null;
  return (
    <ContractsTable
      contracts={contracts}
      isLoading={isLoading}
      emptyState={emptyState}
      onRowSelect={onRowSelect}
    />
  );
};
