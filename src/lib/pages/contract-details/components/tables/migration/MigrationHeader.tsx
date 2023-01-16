import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "lib/components/table";

export const MigrationHeader = ({
  templateColumns,
}: {
  templateColumns: GridProps["templateColumns"];
}) => {
  return (
    <Grid templateColumns={templateColumns}>
      <TableHeader>Code ID</TableHeader>
      <TableHeader>Code Description</TableHeader>
      <TableHeader>Sender</TableHeader>
      <TableHeader>Block Height</TableHeader>
      <TableHeader>Timestamp</TableHeader>
      <TableHeader>Remark</TableHeader>
    </Grid>
  );
};
