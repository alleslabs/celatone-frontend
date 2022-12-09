import { Box, Flex } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import type { Dispatch, SetStateAction } from "react";

import { TextInput } from "lib/components/forms";
import { EmptyState } from "lib/components/state/EmptyState";
import { ZeroState } from "lib/components/state/ZeroState";
import { ContractListReadOnly } from "lib/pages/contracts/components/ContractListReadOnly";
import { ContractListTable } from "lib/pages/contracts/components/ContractListTable";
import type { ContractInfo, ContractListInfo } from "lib/stores/contract";
import type { Option } from "lib/types";

interface FilteredListDetailProps {
  search: string;
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
  contracts,
  isReadOnly,
  isContractRemovable,
  onContractSelect = () => {},
}: FilteredListDetailProps) => {
  const filteredContracts = matchSorter(contracts, search, {
    keys: ["name", "description", "label", "address"],
  });
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
      <ContractListTable
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
  return (
    <Box minH="xs">
      <Box px={isReadOnly ? "0px" : "48px"}>
        <Flex gap={2} w="full" my={isReadOnly ? "24px" : "48px"}>
          <TextInput
            variant="floating"
            value={search}
            setInputState={setSearch}
            placeholder="Search with contract address or contract description"
            size="md"
          />
          {/* TODO: change select component and fix size */}
          {/* {!isReadOnly && (
            <>
              <Select
                focusBorderColor="primary.main"
                w="300px"
                defaultValue="recents"
              >
                <option value="recents">All Tags</option>
                <option value="ascendingAlphabetic">A → Z</option>
                <option value="descendingAlphabetic">Z → A</option>
              </Select>
              <Select
                focusBorderColor="primary.main"
                w="300px"
                defaultValue="recents"
              >
                <option value="recents">Recently Created</option>
                <option value="ascendingAlphabetic">A → Z</option>
                <option value="descendingAlphabetic">Z → A</option>
              </Select>
            </>
          )} */}
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
          contracts={contractListInfo.contracts}
          isReadOnly={isReadOnly}
          isContractRemovable={isContractRemovable}
          onContractSelect={onContractSelect}
        />
      )}
    </Box>
  );
};
