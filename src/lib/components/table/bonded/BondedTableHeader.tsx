import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

export const BondedTableHeader = ({
  isDelegation,
  templateColumns,
}: {
  isDelegation: boolean;
  templateColumns: GridProps["templateColumns"];
}) => (
  <Grid
    minW="min-content"
    sx={{ "& > div": { color: "text.dark" } }}
    templateColumns={templateColumns}
  >
    <TableHeader>Validator</TableHeader>
    <TableHeader>Amount</TableHeader>
    <TableHeader>{isDelegation ? "Reward" : "Unbond Completed By"}</TableHeader>
  </Grid>
);
