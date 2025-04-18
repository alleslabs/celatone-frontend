import type { GridProps } from "@chakra-ui/react";

import { Grid } from "@chakra-ui/react";
import { TableHeader } from "lib/components/table";

export const PublishedEventsTableHeader = ({
  templateColumns,
}: {
  templateColumns: GridProps["templateColumns"];
}) => (
  <Grid templateColumns={templateColumns}>
    <TableHeader />
    <TableHeader>Remark</TableHeader>
    <TableHeader>Upgrade policy changes</TableHeader>
    <TableHeader>Block height</TableHeader>
    <TableHeader>Timestamp</TableHeader>
  </Grid>
);
