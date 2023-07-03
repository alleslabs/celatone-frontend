import { TableContainer, Grid, Box } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";

import { TextInput } from "lib/components/forms";
import { EmptyState } from "lib/components/state";
import { TableHeader, TableTitle, ViewMore } from "lib/components/table";
import { useContractStore } from "lib/providers/store";
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
            placeholder="Search with Contract Address or Contract Name"
            size="lg"
            mb={6}
          />
        )}
        {!publicContracts.length ? (
          <EmptyState
            message="There is currently no contracts related to this project."
            imageVariant={onViewMore && "empty"}
            withBorder
          />
        ) : (
          <>
            <TableContainer>
              <ContractTableHeader />
              {publicContracts.map((contract) => (
                <PublicProjectContractRow
                  key={contract.publicInfo.contractAddress}
                  publicContractInfo={contract}
                  templateColumns={TEMPLATE_COLUMNS}
                />
              ))}
            </TableContainer>
            {contracts.length > 5 && onViewMore && (
              <ViewMore onClick={onViewMore} />
            )}
          </>
        )}
      </Box>
    );
  }
);
