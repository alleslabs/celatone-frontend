import { TableContainer, Flex, Grid, Box } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";

import { TextInput } from "lib/components/forms";
import { EmptyState } from "lib/components/state/EmptyState";
import { TableHeader } from "lib/components/table";
import { TableTitle } from "lib/components/table/TableTitle";
import { ViewMore } from "lib/components/table/ViewMore";
import { useContractStore } from "lib/hooks";
import type { ContractLocalInfo } from "lib/stores/contract";
import type { PublicContract, Option, ContractAddr } from "lib/types";

import { PublicProjectContractRow } from "./PublicProjectContractRow";

export interface PublicContractInfo {
  localInfo: ContractLocalInfo;
  publicInfo: PublicContract;
}
interface PublicProjectContractTableProps {
  contracts: PublicContract[];
  onViewMore?: () => void;
}

const TEMPLATE_COLUMNS = "max(160px) minmax(300px, 1fr) max(200px) max(300px) ";

const ContractTableHeader = () => (
  <Grid templateColumns={TEMPLATE_COLUMNS} minW="min-content">
    <TableHeader>Contract Address</TableHeader>
    <TableHeader>Contract Name</TableHeader>
    <TableHeader>Instantiated By</TableHeader>
    <TableHeader />
  </Grid>
);

export const PublicProjectContractTable = observer(
  ({ contracts = [], onViewMore }: PublicProjectContractTableProps) => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const { getContractLocalInfo } = useContractStore();

    const filteredContracts = useMemo(() => {
      return onViewMore
        ? contracts.slice(0, 5)
        : matchSorter(contracts, searchKeyword, {
            keys: ["name", "contractAddress"],
            threshold: matchSorter.rankings.CONTAINS,
          });
    }, [contracts, onViewMore, searchKeyword]);

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
      <Box mt={12} mb={4}>
        <TableTitle title="Contracts" count={contracts.length} />
        {!onViewMore && (
          <TextInput
            variant="floating"
            value={searchKeyword}
            setInputState={setSearchKeyword}
            placeholder="Search with contract address or contract name"
            size="md"
            mb={6}
          />
        )}
        {!publicContracts.length ? (
          <Flex
            my={6}
            py={6}
            width="full"
            borderBottom="1px solid"
            borderTop="1px solid"
            borderColor="pebble.700"
          >
            <EmptyState
              message="There is currently no contracts related to this project."
              image={
                onViewMore
                  ? undefined
                  : "https://assets.alleslabs.dev/illustration/search-not-found.svg"
              }
            />
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
        {onViewMore && <ViewMore onClick={onViewMore} />}
      </Box>
    );
  }
);
