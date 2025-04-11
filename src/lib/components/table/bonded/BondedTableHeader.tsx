import type { GridProps } from "@chakra-ui/react";

import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

export const BondedTableHeader = ({
  templateColumns,
  isDelegation,
}: {
  templateColumns: GridProps["templateColumns"];
  isDelegation: boolean;
}) => (
  <Grid
    minW="min-content"
    sx={{ "& > div": { color: "text.dark" } }}
    templateColumns={templateColumns}
  >
    <TableHeader>Validator</TableHeader>
    <TableHeader>Amount</TableHeader>
    <TableHeader>{isDelegation ? "Reward" : "Unbond completed by"}</TableHeader>
  </Grid>
);
