import type { GridProps } from "@chakra-ui/react";

import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

export const SavedAccountsTableHeader = ({
  hasHexAddr,
  templateColumns,
}: {
  templateColumns: GridProps["templateColumns"];
  hasHexAddr: boolean;
}) => (
  <Grid minW="min-content" templateColumns={templateColumns}>
    <TableHeader>Account address</TableHeader>
    {hasHexAddr && <TableHeader>Hex address</TableHeader>}
    <TableHeader>Account name</TableHeader>
    <TableHeader>Account description</TableHeader>
    <TableHeader />
  </Grid>
);
