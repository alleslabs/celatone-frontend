import { TableContainer, Flex, Box, Grid } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import { MdSearchOff } from "react-icons/md";

import { TextInput } from "lib/components/forms";
import { EmptyState } from "lib/components/state/EmptyState";
import { TableHeaderNoBorder } from "lib/components/table";
import { useContractStore } from "lib/hooks";
import type { ContractLocalInfo } from "lib/stores/contract";
import type { PublicContract, Option, ContractAddr } from "lib/types";

import { PublicProjectContractRow } from "./PublicProjectContractRow";

interface PublicProjectContractTableProps {
  contracts: PublicContract[];
  hasSearchInput?: boolean;
}

export interface PublicContractInfo {
  localInfo: ContractLocalInfo;
  publicInfo: PublicContract;
}

const TEMPLATE_COLUMNS = "max(160px) minmax(300px, 1fr) max(200px) max(300px) ";

const ContractTableHeader = () => (
  <Grid
    templateColumns={TEMPLATE_COLUMNS}
    px="32px"
    borderBottom="1px solid"
    borderColor="pebble.700"
  >
    <TableHeaderNoBorder>Contract Address</TableHeaderNoBorder>
    <TableHeaderNoBorder>Contract Name</TableHeaderNoBorder>
    <TableHeaderNoBorder>Instantiated By</TableHeaderNoBorder>
    <TableHeaderNoBorder />
  </Grid>
);

export const PublicProjectContractTable = observer(
  ({
    contracts = [],
    hasSearchInput = true,
  }: PublicProjectContractTableProps) => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const { getContractLocalInfo } = useContractStore();

    const filteredContracts = useMemo(() => {
      return matchSorter(contracts, searchKeyword, {
        keys: ["name", "contractAddress"],
        threshold: matchSorter.rankings.CONTAINS,
      });
    }, [contracts, searchKeyword]);

    const publicContracts: Option<PublicContractInfo[]> =
      filteredContracts?.map((contract) => ({
        localInfo: {
          contractAddress: contract.contractAddress as ContractAddr,
          instantiator: contract.instantiator,
          label: contract.label,
          ...getContractLocalInfo(contract.contractAddress),
        },
        publicInfo: {
          ...contract,
        },
      }));

    return (
      <Box>
        {hasSearchInput && (
          <Flex px="12">
            <TextInput
              variant="floating"
              value={searchKeyword}
              setInputState={setSearchKeyword}
              placeholder="Search with contract address or contract name"
              size="md"
              mb={6}
            />
          </Flex>
        )}
        {!publicContracts.length ? (
          <Flex my={8}>
            <EmptyState message="No contract found." icon={MdSearchOff} />
          </Flex>
        ) : (
          <TableContainer mb={10}>
            <ContractTableHeader />
            {publicContracts.map((contract) => (
              <PublicProjectContractRow
                key={contract.publicInfo.contractAddress}
                publicContractInfo={contract}
                templateColumn={TEMPLATE_COLUMNS}
              />
            ))}
          </TableContainer>
        )}
      </Box>
    );
  }
);
