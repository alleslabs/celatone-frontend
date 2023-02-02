import { Grid } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableContainer, TableHeader, TableRow } from "lib/components/table";
import type { ContractLocalInfo } from "lib/stores/contract";
import type { ContractAddr } from "lib/types";

import { ContractNameCell } from "./table/ContractNameCell";
import { TagsCell } from "./table/TagsCell";

interface ContractListReadOnlyTableProps {
  contracts: ContractLocalInfo[];
  onContractSelect: (addr: ContractAddr) => void;
}

const TEMPLATE_COLUMNS = "160px 1fr 220px 160px";

export const ContractListReadOnlyTable = ({
  contracts = [],
  onContractSelect,
}: ContractListReadOnlyTableProps) => {
  return (
    <TableContainer my={4}>
      <Grid
        templateColumns={TEMPLATE_COLUMNS}
        sx={{ "& div": { color: "text.dark" } }}
      >
        <TableHeader>Contract Address</TableHeader>
        <TableHeader>Contract Name</TableHeader>
        <TableHeader>Tags</TableHeader>
        <TableHeader>Instantiated by</TableHeader>
      </Grid>
      {contracts.map((item) => (
        <Grid
          templateColumns={TEMPLATE_COLUMNS}
          _hover={{ bg: "pebble.800" }}
          transition="all .25s ease-in-out"
          key={item.contractAddress}
          onClick={() => {
            onContractSelect(item.contractAddress);
          }}
          cursor="pointer"
        >
          <TableRow>
            <ExplorerLink
              value={item.contractAddress}
              type="contract_address"
              isReadOnly
            />
          </TableRow>
          <TableRow>
            <ContractNameCell contractLocalInfo={item} isReadOnly />
          </TableRow>
          <TableRow>
            <TagsCell contractLocalInfo={item} isReadOnly />
          </TableRow>
          <TableRow>
            <ExplorerLink
              value={item.instantiator}
              type="user_address"
              isReadOnly
            />
          </TableRow>
        </Grid>
      ))}
    </TableContainer>
  );
};
