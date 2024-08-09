import { Box, Grid, GridItem } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import { useMemo, useState } from "react";

import InputWithIcon from "../InputWithIcon";
import { ContractsTable } from "../table";
import { useCurrentChain, useTierConfig } from "lib/app-provider";
import { DisconnectedState, EmptyState, ZeroState } from "lib/components/state";
import { TagSelection } from "lib/components/TagSelection";
import { INSTANTIATED_LIST_NAME } from "lib/data";
import { useAdminsByContractAddresses } from "lib/services/wasm/contract";
import type { ContractListInfo } from "lib/stores/contract";
import type { BechAddr32, ContractInfo } from "lib/types";
import { formatSlugName } from "lib/utils";

interface ContractListContentProps {
  contractListInfo: ContractListInfo;
  filteredContracts: ContractInfo[];
  onContractSelect: (addr: BechAddr32) => void;
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
            message="No matching contracts found.
          Make sure you are searching with a contract address, name, or description."
            withBorder
          />
        )
      }
      onRowSelect={onContractSelect}
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
  onContractSelect,
  isReadOnly = false,
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
          latestUpdater: undefined,
          latestUpdated: undefined,
          remark: undefined,
        })),
    [admins, contractListInfo.contracts, searchKeyword, tagFilter]
  );

  return (
    <Box minH="xs">
      <Grid
        w="full"
        gap={4}
        templateColumns={isReadOnly ? "1fr" : "3fr 1fr"}
        my={isReadOnly ? 6 : 8}
      >
        <GridItem w="full">
          <InputWithIcon
            placeholder="Search with Contract Address, Name, or Description"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            size={{ base: "md", md: "lg" }}
            amptrackSection="contract-list-item-search"
          />
        </GridItem>
        {!isReadOnly && (
          <GridItem w="full">
            <TagSelection
              result={tagFilter}
              setResult={setTagFilter}
              placeholder="No tag selected"
              label="Filter by tag"
              boxWidth="400px"
              creatable={false}
            />
          </GridItem>
        )}
      </Grid>
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
