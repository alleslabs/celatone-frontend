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
    templateColumns={templateColumns}
    minW="min-content"
    sx={{ "& > div": { color: "text.dark" } }}
  >
    <TableHeader>Validator</TableHeader>
    <TableHeader>Amount</TableHeader>
    <TableHeader>{isDelegation ? "Reward" : "Unbond Completed By"}</TableHeader>
  </Grid>
);
