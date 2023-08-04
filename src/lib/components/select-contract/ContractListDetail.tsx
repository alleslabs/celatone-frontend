import { Box, Flex } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import { useMemo, useState } from "react";

import { ContractsTable } from "../table";
import { useCurrentChain } from "lib/app-provider";
import { TextInput } from "lib/components/forms";
import { DisconnectedState, EmptyState, ZeroState } from "lib/components/state";
import { TagSelection } from "lib/components/TagSelection";
import { INSTANTIATED_LIST_NAME } from "lib/data";
import { useAdminByContractAddresses } from "lib/services/contractService";
import type { ContractListInfo } from "lib/stores/contract";
import type { ContractAddr, ContractInfo } from "lib/types";
import { formatSlugName } from "lib/utils";

interface ContractListContentProps {
  contractListInfo: ContractListInfo;
  filteredContracts: ContractInfo[];
  onContractSelect: (addr: ContractAddr) => void;
  isLoading: boolean;
  isReadOnly: boolean;
}

const ContractListContent = ({
  contractListInfo,
  filteredContracts,
  isLoading,
  onContractSelect,
  isReadOnly,
}: ContractListContentProps) => {
  const { address } = useCurrentChain();
  const isInstantiatedByMe =
    contractListInfo.slug === formatSlugName(INSTANTIATED_LIST_NAME);

  if (!address && isInstantiatedByMe) {
    return (
      <DisconnectedState text="to see contracts you've previously instantiated." />
    );
  }

  return (
    <ContractsTable
      contracts={filteredContracts}
      isLoading={isInstantiatedByMe && isLoading}
      emptyState={
        !contractListInfo.contracts.length ? (
          <ZeroState
            list={{
              label: contractListInfo.name,
              value: contractListInfo.slug,
            }}
            isReadOnly={isReadOnly}
          />
        ) : (
          <EmptyState
            imageVariant="not-found"
            message="No contracts match found. 
  Make sure you are searching with contract address, name, or description."
          />
        )
      }
      onRowSelect={onContractSelect}
      isReadOnly={isReadOnly}
      withCTA={
        isReadOnly
          ? undefined
          : {
              removingContractList: contractListInfo.isContractRemovable
                ? { label: contractListInfo.name, value: contractListInfo.slug }
                : undefined,
            }
      }
    />
  );
};

interface ContractListDetailProps {
  contractListInfo: ContractListInfo;
  isLoading: boolean;
  isReadOnly?: boolean;
  onContractSelect: (addr: ContractAddr) => void;
}

export const ContractListDetail = ({
  contractListInfo,
  isLoading,
  onContractSelect,
  isReadOnly = false,
}: ContractListDetailProps) => {
  const { data: admins = {} } = useAdminByContractAddresses(
    isReadOnly
      ? []
      : contractListInfo.contracts.map((contract) => contract.contractAddress)
  );

  const [searchKeyword, setSearchKeyword] = useState("");
  const [tagFilter, setTagFilter] = useState<string[]>([]);

  const filteredContracts = useMemo(
    () =>
      matchSorter(contractListInfo.contracts, searchKeyword, {
        keys: ["name", "description", "label", "contractAddress"],
        sorter: (sortedItem) => sortedItem,
      })
        .filter((contract) =>
          tagFilter.every((tag) => contract.tags?.includes(tag))
        )
        .map<ContractInfo>((contractLocalInfo) => ({
          ...contractLocalInfo,
          admin: admins[contractLocalInfo.contractAddress],
          latestUpdater: undefined,
          latestUpdated: undefined,
          remark: undefined,
        })),
    [admins, contractListInfo.contracts, searchKeyword, tagFilter]
  );

  return (
    <Box minH="xs">
      <Flex gap={3} w="full" my={isReadOnly ? "24px" : "48px"}>
        <TextInput
          variant="floating"
          value={searchKeyword}
          setInputState={setSearchKeyword}
          placeholder="Search with Contract Address, Name, or Description"
          size={!isReadOnly ? "lg" : "md"}
        />
        {!isReadOnly && (
          <TagSelection
            result={tagFilter}
            setResult={setTagFilter}
            placeholder="No tag selected"
            label="Filter by tag"
            boxWidth="400px"
            creatable={false}
          />
        )}
      </Flex>
      <ContractListContent
        contractListInfo={contractListInfo}
        filteredContracts={filteredContracts}
        isLoading={isLoading}
        onContractSelect={onContractSelect}
        isReadOnly={isReadOnly}
      />
    </Box>
  );
};
