import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

export const ContractsTableHeader = ({
  templateColumns,
}: {
  templateColumns: GridProps["templateColumns"];
}) => (
  <Grid templateColumns={templateColumns} minW="min-content">
    <TableHeader borderTopStyle="none">Contract Address</TableHeader>
    <TableHeader>Contract Name</TableHeader>
    <TableHeader>Tags</TableHeader>
    <TableHeader>Instantiator</TableHeader>
    <TableHeader>Timestamp</TableHeader>
    <TableHeader />
  </Grid>
);
