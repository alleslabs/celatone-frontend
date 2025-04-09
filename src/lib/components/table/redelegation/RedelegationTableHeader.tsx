import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

export const RedelegationTableHeader = ({
  templateColumns,
}: {
  templateColumns: GridProps["templateColumns"];
}) => (
  <Grid templateColumns={templateColumns} minW="min-content">
    <TableHeader>From validator</TableHeader>
    <TableHeader />
    <TableHeader>To validator</TableHeader>
    <TableHeader>Redelegate amount</TableHeader>
    <TableHeader>Completed by</TableHeader>
  </Grid>
);
