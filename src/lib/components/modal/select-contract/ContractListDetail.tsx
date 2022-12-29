import { Box, Flex } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import { useMemo, useState } from "react";

import { TagSelection, TextInput } from "lib/components/forms";
import { EmptyState } from "lib/components/state/EmptyState";
import { ZeroState } from "lib/components/state/ZeroState";
import { ContractListReadOnlyTable } from "lib/pages/contract-list/components/ContractListReadOnlyTable";
import { ContractListTable } from "lib/pages/contract-list/components/ContractListTable";
import type { ContractInfo, ContractListInfo } from "lib/stores/contract";
import type { ContractAddr, Option } from "lib/types";

interface FilteredListDetailProps {
  contracts: ContractInfo[];
  isReadOnly?: boolean;
  contractRemovalInfo?: Option;
  onContractSelect?: (addr: ContractAddr) => void;
}

const FilteredListDetail = ({
  contracts,
  isReadOnly,
  contractRemovalInfo,
  onContractSelect = () => {},
}: FilteredListDetailProps) => {
  if (contracts.length === 0)
    return (
      <EmptyState
        message="No contracts match found. 
        Make sure you are searching with contract address, name, or description."
      />
    );

  return isReadOnly ? (
    <ContractListReadOnlyTable
      contracts={contracts}
      onContractSelect={onContractSelect}
    />
  ) : (
    <ContractListTable
      contracts={contracts}
      contractRemovalInfo={contractRemovalInfo}
    />
  );
};

interface ContractListDetailProps {
  contractListInfo: ContractListInfo;
  isReadOnly?: boolean;
  isInstantiatedByMe?: boolean;
  onContractSelect?: (addr: ContractAddr) => void;
}

export const ContractListDetail = ({
  contractListInfo,
  isReadOnly,
  isInstantiatedByMe = false,
  onContractSelect,
}: ContractListDetailProps) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [tagFilter, setTagFilter] = useState<string[]>([]);

  const filteredContracts = useMemo(
    () =>
      matchSorter(contractListInfo.contracts, searchKeyword, {
        keys: ["name", "description", "label", "address"],
        sorter: (sortedItem) => sortedItem,
      }).filter((contract) =>
        tagFilter.every((tag) => contract.tags?.includes(tag))
      ),
    [contractListInfo.contracts, searchKeyword, tagFilter]
  );

  return (
    <Box minH="xs" pb="48px">
      <Box px={isReadOnly ? "0px" : "48px"}>
        <Flex gap={2} w="full" my={isReadOnly ? "24px" : "48px"}>
          <TextInput
            variant="floating"
            value={searchKeyword}
            setInputState={setSearchKeyword}
            placeholder="Search with contract address, name, or description"
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
      </Box>
      {contractListInfo.contracts.length === 0 ? (
        <ZeroState
          list={{ label: contractListInfo.name, value: contractListInfo.slug }}
          isReadOnly={isReadOnly}
          isInstantiatedByMe={isInstantiatedByMe}
        />
      ) : (
        <FilteredListDetail
          contracts={filteredContracts}
          isReadOnly={isReadOnly}
          contractRemovalInfo={
            contractListInfo.isContractRemovable
              ? { label: contractListInfo.name, value: contractListInfo.slug }
              : undefined
          }
          onContractSelect={onContractSelect}
        />
      )}
    </Box>
  );
};
