import { Box, Grid } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";

import { useMobile } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import { EmptyState } from "lib/components/state";
import {
  MobileTableContainer,
  TableContainer,
  TableHeader,
  TableTitle,
  ViewMore,
} from "lib/components/table";
import { useContractStore } from "lib/providers/store";
import type { WasmVerifyInfosResponse } from "lib/services/types";
import { useWasmVerifyInfos } from "lib/services/verification/wasm";
import type { ContractLocalInfo } from "lib/stores/contract";
import type { Option, PublicContract } from "lib/types";

import { PublicProjectContractMobileCard } from "./PublicProjectContractMobileCard";
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
    <TableHeader>Contract address</TableHeader>
    <TableHeader>Contract name</TableHeader>
    <TableHeader>Instantiated by</TableHeader>
    <TableHeader />
  </Grid>
);

const ContentRender = ({
  publicContracts,
  wasmVerifyInfos,
}: {
  publicContracts: PublicContractInfo[];
  wasmVerifyInfos: Option<WasmVerifyInfosResponse>;
}) => {
  const isMobile = useMobile();
  return isMobile ? (
    <MobileTableContainer>
      {publicContracts.map((contract) => (
        <PublicProjectContractMobileCard
          key={contract.publicInfo.contractAddress}
          publicContractInfo={contract}
          wasmVerifyInfo={wasmVerifyInfos?.[contract.publicInfo.code]}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <ContractTableHeader />
      {publicContracts.map((contract) => (
        <PublicProjectContractRow
          key={contract.publicInfo.contractAddress}
          templateColumns={TEMPLATE_COLUMNS}
          publicContractInfo={contract}
          wasmVerifyInfo={wasmVerifyInfos?.[contract.publicInfo.code]}
        />
      ))}
    </TableContainer>
  );
};

export const PublicProjectContractTable = observer(
  ({ contracts = [], onViewMore }: PublicProjectContractTableProps) => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const { getContractLocalInfo } = useContractStore();

    const { data: wasmVerifyInfos } = useWasmVerifyInfos(
      contracts.map((contract) => contract.code),
      !!contracts
    );

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
          contractAddress: contract.contractAddress,
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
            placeholder="Search with contract address or contract name"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            size={{ base: "md", md: "lg" }}
            my={2}
            amptrackSection="public-project-contract-search"
          />
        )}
        {publicContracts.length ? (
          <ContentRender
            publicContracts={publicContracts}
            wasmVerifyInfos={wasmVerifyInfos}
          />
        ) : (
          <EmptyState
            message={
              contracts.length
                ? "No matching contracts found for this project. Make sure you are searching with Contract Address or Contract Name"
                : "There are currently no contracts related to this project."
            }
            imageVariant={contracts.length ? "not-found" : "empty"}
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
