import { Box, Flex } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { matchSorter } from "match-sorter";
import { useMemo, useState } from "react";

import { TextInput } from "lib/components/forms";
import { Loading } from "lib/components/Loading";
import { DisconnectedState, EmptyState, ZeroState } from "lib/components/state";
import { TagSelection } from "lib/components/TagSelection";
import { INSTANTIATED_LIST_NAME } from "lib/data";
import type { ContractLocalInfo, ContractListInfo } from "lib/stores/contract";
import type { ContractAddr, HumanAddr, LVPair, Option } from "lib/types";
import { formatSlugName } from "lib/utils";

import { ContractListReadOnlyTable } from "./ContractListReadOnlyTable";
import { ContractListTable } from "./ContractListTable";

interface FilteredListDetailProps {
  contracts: ContractLocalInfo[];
  isReadOnly?: boolean;
  contractRemovalInfo?: LVPair;
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
        imageVariant="not-found"
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

interface ContractListTableProps {
  address: Option<HumanAddr>;
  contractListInfo: ContractListInfo;
  isLoading?: boolean;
  isReadOnly?: boolean;
  filteredContracts: ContractLocalInfo[];
  onContractSelect?: (addr: ContractAddr) => void;
}

const ContractListContent = ({
  address,
  contractListInfo,
  isReadOnly,
  filteredContracts,
  onContractSelect,
  isLoading,
}: ContractListTableProps) => {
  const isInstantiatedByMe =
    contractListInfo.slug === formatSlugName(INSTANTIATED_LIST_NAME);

  if (!address && isInstantiatedByMe) {
    return (
      <DisconnectedState text="to see contracts you've previously instantiated." />
    );
  }
  if (isLoading) {
    return <Loading />;
  }
  if (contractListInfo.contracts.length === 0) {
    return (
      <ZeroState
        list={{
          label: contractListInfo.name,
          value: contractListInfo.slug,
        }}
        isReadOnly={isReadOnly}
      />
    );
  }
  return (
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
  );
};

interface ContractListDetailProps {
  contractListInfo: ContractListInfo;
  isLoading?: boolean;
  isReadOnly?: boolean;
  onContractSelect?: (addr: ContractAddr) => void;
}

export const ContractListDetail = ({
  contractListInfo,
  isLoading,
  isReadOnly,
  onContractSelect,
}: ContractListDetailProps) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const { address } = useWallet();
  const filteredContracts = useMemo(
    () =>
      matchSorter(contractListInfo.contracts, searchKeyword, {
        keys: ["name", "description", "label", "contractAddress"],
        sorter: (sortedItem) => sortedItem,
      }).filter((contract) =>
        tagFilter.every((tag) => contract.tags?.includes(tag))
      ),
    [contractListInfo.contracts, searchKeyword, tagFilter]
  );

  return (
    <Box minH="xs" pb={isReadOnly ? "0px" : "48px"}>
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
      <ContractListContent
        address={address as HumanAddr}
        contractListInfo={contractListInfo}
        filteredContracts={filteredContracts}
        isReadOnly={isReadOnly}
        onContractSelect={onContractSelect}
        isLoading={isLoading}
      />
    </Box>
  );
};
