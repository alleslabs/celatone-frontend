import type { ContractListInfo } from "lib/stores/contract";
import type { BechAddr32, ContractInfo } from "lib/types";

import { Box, Grid, GridItem } from "@chakra-ui/react";
import { useCurrentChain, useTierConfig } from "lib/app-provider";
import { DisconnectedState, EmptyState, ZeroState } from "lib/components/state";
import { TagSelection } from "lib/components/TagSelection";
import { INSTANTIATED_LIST_NAME } from "lib/data";
import { useAdminsByContractAddresses } from "lib/services/wasm/contract";
import { formatSlugName } from "lib/utils";
import { matchSorter } from "match-sorter";
import { useMemo, useState } from "react";

import InputWithIcon from "../InputWithIcon";
import { ContractsTable } from "../table";

interface ContractListContentProps {
  contractListInfo: ContractListInfo;
  filteredContracts: ContractInfo[];
  isLoading: boolean;
  isReadOnly: boolean;
  onContractSelect: (addr: BechAddr32) => void;
}

const ContractListContent = ({
  contractListInfo,
  filteredContracts,
  isLoading,
  isReadOnly,
  onContractSelect,
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
      emptyState={
        !contractListInfo.contracts.length ? (
          <ZeroState
            isReadOnly={isReadOnly}
            list={{
              label: contractListInfo.name,
              value: contractListInfo.slug,
            }}
          />
        ) : (
          <EmptyState
            imageVariant="not-found"
            message="No matching contracts found.
          Make sure you are searching with a contract address, name, or description."
            withBorder
          />
        )
      }
      isLoading={isInstantiatedByMe && isLoading}
      isReadOnly={isReadOnly}
      withCta={
        isReadOnly
          ? undefined
          : {
              removingContractList: contractListInfo.isContractRemovable
                ? { label: contractListInfo.name, value: contractListInfo.slug }
                : undefined,
            }
      }
      onRowSelect={onContractSelect}
    />
  );
};

interface ContractListDetailProps {
  contractListInfo: ContractListInfo;
  isLoading: boolean;
  isReadOnly?: boolean;
  onContractSelect: (addr: BechAddr32) => void;
}

export const ContractListDetail = ({
  contractListInfo,
  isLoading,
  isReadOnly = false,
  onContractSelect,
}: ContractListDetailProps) => {
  const { isFullTier } = useTierConfig();
  const dataFull = useAdminsByContractAddresses(
    isReadOnly || !isFullTier
      ? []
      : contractListInfo.contracts.map((contract) => contract.contractAddress)
  );
  const { data: admins = {} } = isFullTier ? dataFull : {};

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
          latestUpdated: undefined,
          latestUpdater: undefined,
          remark: undefined,
        })),
    [admins, contractListInfo.contracts, searchKeyword, tagFilter]
  );

  return (
    <Box minH="xs">
      <Grid
        gap={4}
        my={isReadOnly ? 6 : 8}
        templateColumns={isReadOnly ? "1fr" : "3fr 1fr"}
        w="full"
      >
        <GridItem w="full">
          <InputWithIcon
            amptrackSection="contract-list-item-search"
            placeholder="Search with contract address, name, or description"
            size={{ base: "md", md: "lg" }}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </GridItem>
        {!isReadOnly && (
          <GridItem w="full">
            <TagSelection
              boxWidth="400px"
              creatable={false}
              label="Filter by tag"
              placeholder="No tag selected"
              result={tagFilter}
              setResult={setTagFilter}
            />
          </GridItem>
        )}
      </Grid>
      <ContractListContent
        contractListInfo={contractListInfo}
        filteredContracts={filteredContracts}
        isLoading={isLoading}
        isReadOnly={isReadOnly}
        onContractSelect={onContractSelect}
      />
    </Box>
  );
};
