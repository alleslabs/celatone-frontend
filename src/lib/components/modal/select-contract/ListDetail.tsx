import { Box, Flex } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import { TagSelection, TextInput } from "lib/components/forms";
import { EmptyState } from "lib/components/state/EmptyState";
import { ZeroState } from "lib/components/state/ZeroState";
import { useContractStore, useUserKey } from "lib/hooks";
import { ContractList } from "lib/pages/contracts/components/ContractList";
import { ContractListReadOnly } from "lib/pages/contracts/components/ContractListReadOnly";
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
  }).filter((contract) =>
    tagFilter.every((tag) => contract.tags?.includes(tag))
  );
  if (filteredContracts.length === 0)
    return (
      <EmptyState
        message="No past transaction matches found with your input. You can search with
transaction hash, contract address, contract name, tags, and
instantiator names."
      />
    );
  if (!isReadOnly)
    return (
      <ContractList
        contracts={filteredContracts}
        isContractRemovable={isContractRemovable}
      />
    );
  return (
    <ContractListReadOnly
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
            placeholder="Search with contract address or contract description"
            size="lg"
          />
          {!isReadOnly && (
            <TagSelection
              options={getAllTags(userKey)}
              result={tagFilter}
              setResult={(selectedTags) => setTagFilter(selectedTags)}
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
