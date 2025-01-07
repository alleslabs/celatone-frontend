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
  <Grid minW="min-content" templateColumns={TEMPLATE_COLUMNS}>
    <TableHeader>Contract Address</TableHeader>
    <TableHeader>Contract Name</TableHeader>
    <TableHeader>Instantiated By</TableHeader>
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
          publicContractInfo={contract}
          templateColumns={TEMPLATE_COLUMNS}
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
      <Box mb={4} mt={{ base: 8, md: 12 }}>
        <TableTitle title="Contracts" count={contracts.length} />
        {!onViewMore && (
          <InputWithIcon
            my={2}
            size={{ base: "md", md: "lg" }}
            value={searchKeyword}
            amptrackSection="public-project-contract-search"
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Search with Contract Address or Contract Name"
          />
        )}
        {publicContracts.length ? (
          <ContentRender
            publicContracts={publicContracts}
            wasmVerifyInfos={wasmVerifyInfos}
          />
        ) : (
          <EmptyState
            imageVariant={contracts.length ? "not-found" : "empty"}
            message={
              contracts.length
                ? "No matching contracts found for this project. Make sure you are searching with Contract Address or Contract Name"
                : "There are currently no contracts related to this project."
            }
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
