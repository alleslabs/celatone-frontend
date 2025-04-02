import type { GridProps } from "@chakra-ui/react";

import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

export const RedelegationTableHeader = ({
  templateColumns,
}: {
  templateColumns: GridProps["templateColumns"];
}) => (
  <Grid minW="min-content" templateColumns={templateColumns}>
    <TableHeader>From Validator</TableHeader>
    <TableHeader />
    <TableHeader>To Validator</TableHeader>
    <TableHeader>Redelegate Amount</TableHeader>
    <TableHeader>Completed By</TableHeader>
  </Grid>
);
