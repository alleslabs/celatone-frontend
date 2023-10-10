import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "lib/components/table";

export const ModuleHistoryHeader = ({
  templateColumns,
}: {
  templateColumns: GridProps["templateColumns"];
}) => (
  <Grid templateColumns={templateColumns}>
    <TableHeader>Remark</TableHeader>
    <TableHeader>Upgrade Policy Changes</TableHeader>
    <TableHeader>Block Height</TableHeader>
    <TableHeader>Timestamp</TableHeader>
  </Grid>
);
