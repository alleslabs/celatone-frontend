import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

export const ModulesTableHeader = ({
  templateColumns,
}: {
  templateColumns: GridProps["templateColumns"];
}) => (
  <Grid templateColumns={templateColumns} minW="min-content">
    <TableHeader>Module Path</TableHeader>
    <TableHeader>Creator</TableHeader>
    <TableHeader>Timestamp</TableHeader>
    <TableHeader />
  </Grid>
);
