import { Grid, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import {
  ContractNameCell,
  TableContainer,
  TableHeader,
  TableRow,
  TagsCell,
} from "lib/components/table";
import type { ContractLocalInfo } from "lib/stores/contract";
import type { ContractAddr } from "lib/types";

interface ContractListReadOnlyTableProps {
  contracts: ContractLocalInfo[];
  onContractSelect: (addr: ContractAddr) => void;
}

const TEMPLATE_COLUMNS = "160px 280px 260px 1fr";

export const ContractListReadOnlyTable = ({
  contracts = [],
  onContractSelect,
}: ContractListReadOnlyTableProps) => (
  <TableContainer my={4} position="relative">
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
          {item.instantiator ? (
            <ExplorerLink
              value={item.instantiator}
              type="user_address"
              isReadOnly
            />
          ) : (
            <Text variant="body2" color="text.dark">
              N/A
            </Text>
          )}
        </TableRow>
      </Grid>
    ))}
  </TableContainer>
);
