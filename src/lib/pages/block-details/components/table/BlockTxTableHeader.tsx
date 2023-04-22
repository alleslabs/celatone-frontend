import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "lib/components/table";

export const BlockTxTableHeader = ({
  templateColumns,
  scrollComponentId,
}: {
  templateColumns: GridProps["templateColumns"];
  scrollComponentId: string;
}) => (
  <Grid
    templateColumns={templateColumns}
    minW="min-content"
    id={scrollComponentId}
  >
    <TableHeader>Transaction Hash</TableHeader>
    <TableHeader />
    <TableHeader>Messages</TableHeader>
    <TableHeader>Sender</TableHeader>
    <TableHeader />
  </Grid>
);
