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
    <TableHeader>Upgrade Policy Changes</TableHeader>
    <TableHeader>Block Height</TableHeader>
    <TableHeader>Timestamp</TableHeader>
  </Grid>
);
