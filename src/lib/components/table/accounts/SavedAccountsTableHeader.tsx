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
  <Grid templateColumns={templateColumns} minW="min-content">
    <TableHeader>Account address</TableHeader>
    {hasHexAddr && <TableHeader>Hex address</TableHeader>}
    <TableHeader>Account name</TableHeader>
    <TableHeader>Account description</TableHeader>
    <TableHeader />
  </Grid>
);
