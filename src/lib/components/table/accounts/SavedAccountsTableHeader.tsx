import type { GridProps } from "@chakra-ui/react";

import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

export const SavedAccountsTableHeader = ({
  templateColumns,
  hasHexAddr,
}: {
  templateColumns: GridProps["templateColumns"];
  hasHexAddr: boolean;
}) => (
  <Grid minW="min-content" templateColumns={templateColumns}>
    <TableHeader>Account Address</TableHeader>
    {hasHexAddr && <TableHeader>Hex Address</TableHeader>}
    <TableHeader>Account Name</TableHeader>
    <TableHeader>Account Description</TableHeader>
    <TableHeader />
  </Grid>
);
