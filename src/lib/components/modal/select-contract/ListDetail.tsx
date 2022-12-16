import { Box, Flex } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import { TagSelection, TextInput } from "lib/components/forms";
import { EmptyState } from "lib/components/state/EmptyState";
import { ZeroState } from "lib/components/state/ZeroState";
import { useContractStore, useUserKey } from "lib/hooks";
import { ContractListReadOnlyTable } from "lib/pages/contracts/components/ContractListReadOnlyTable";
import { ContractListTable } from "lib/pages/contracts/components/ContractListTable";
import type { ContractInfo, ContractListInfo } from "lib/stores/contract";
import type { Option } from "lib/types";

interface FilteredListDetailProps {
  search: string;
  tagFilter: string[];
  contracts: ContractInfo[];
  isReadOnly: boolean;
  isContractRemovable?: Option;
  onContractSelect?: (addr: string) => void;
}

interface ListDetailProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  contractListInfo: ContractListInfo;
  isReadOnly: boolean;
  isContractRemovable?: Option;
  onContractSelect?: (addr: string) => void;
}

const FilteredListDetail = ({
  search,
  tagFilter,
  contracts,
  isReadOnly,
  isContractRemovable,
  onContractSelect = () => {},
}: FilteredListDetailProps) => {
  const filteredContracts = matchSorter(contracts, search, {
    keys: ["name", "description", "label", "address"],
    sorter: (sortedItem) => sortedItem,
  }).filter((contract) =>
    tagFilter.every((tag) => contract.tags?.includes(tag))
  );
  if (filteredContracts.length === 0)
    return (
      <EmptyState
        message="No contracts match found. 
        Make sure you are searching with contract address, name, or description."
      />
    );
  if (!isReadOnly)
    return (
      <ContractListTable
        contracts={filteredContracts}
        isContractRemovable={isContractRemovable}
      />
    );
  return (
    <ContractListReadOnlyTable
      contracts={filteredContracts}
      onContractSelect={onContractSelect}
    />
  );
};

export const ListDetail = ({
  search,
  setSearch,
  contractListInfo,
  isReadOnly,
  isContractRemovable,
  onContractSelect,
}: ListDetailProps) => {
  const userKey = useUserKey();
  const { getAllTags } = useContractStore();

  const [tagFilter, setTagFilter] = useState<string[]>([]);

  return (
    <Box minH="xs">
      <Box px={isReadOnly ? "0px" : "48px"}>
        <Flex gap={2} w="full" my={isReadOnly ? "24px" : "48px"}>
          <TextInput
            variant="floating"
            value={search}
            setInputState={setSearch}
            placeholder="Search with contract address, name, or description"
            size="lg"
          />
          {!isReadOnly && (
            <TagSelection
              options={getAllTags(userKey)}
              result={tagFilter}
              setResult={setTagFilter}
              placeholder="No tag selected"
              label="Filter by tag"
              labelBgColor="background.main"
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
        />
      ) : (
        <FilteredListDetail
          search={search}
          tagFilter={tagFilter}
          contracts={contractListInfo.contracts}
          isReadOnly={isReadOnly}
          isContractRemovable={isContractRemovable}
          onContractSelect={onContractSelect}
        />
      )}
    </Box>
  );
};
