import { TableContainer, Grid, Box, Flex } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";

import { useMobile } from "lib/app-provider";
import { PublicContractCard } from "lib/components/card/PublicContractCard";
import InputWithIcon from "lib/components/InputWithIcon";
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

const ContentRender = ({
  publicContracts,
  isMobile,
}: {
  publicContracts: PublicContractInfo[];
  isMobile: boolean;
}) =>
  isMobile ? (
    <Flex direction="column" gap={4} w="full" mt={4}>
      {publicContracts.map((contract) => (
        <PublicContractCard
          publicInfo={contract.publicInfo}
          key={contract.publicInfo.contractAddress}
        />
      ))}
    </Flex>
  ) : (
    <TableContainer mt={6}>
      <ContractTableHeader />
      {publicContracts.map((contract) => (
        <PublicProjectContractRow
          key={contract.publicInfo.contractAddress}
          publicContractInfo={contract}
          templateColumns={TEMPLATE_COLUMNS}
        />
      ))}
    </TableContainer>
  );

export const PublicProjectContractTable = observer(
  ({ contracts = [], onViewMore }: PublicProjectContractTableProps) => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const { getContractLocalInfo } = useContractStore();
    const isMobile = useMobile();

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
      <Box mt={{ base: 8, md: 12 }} mb={4}>
        <TableTitle title="Contracts" count={contracts.length} />
        {!onViewMore && (
          <InputWithIcon
            placeholder="Search with Contract Address or Contract Name"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            size="lg"
          />
        )}
        {publicContracts.length ? (
          <ContentRender
            publicContracts={publicContracts}
            isMobile={isMobile}
          />
        ) : (
          <EmptyState
            my={4}
            message={
              contracts.length
                ? "No matching contract found for this project. Make sure you are searching with Contract Address or Contract Name"
                : "There is currently no contracts related to this project."
            }
            imageVariant={onViewMore && "empty"}
            withBorder
          />
        )}
        {contracts.length > 5 && onViewMore && (
          <ViewMore onClick={onViewMore} />
        )}
      </Box>
    );
  }
);
