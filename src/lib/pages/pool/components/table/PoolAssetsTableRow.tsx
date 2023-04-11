import type { GridProps } from "@chakra-ui/react";
import { Grid, Text } from "@chakra-ui/react";

import { TableRow } from "lib/components/table/tableComponents";

interface PoolAssetsTableRowProps {
  // proposal: Proposal;
  templateColumns: GridProps["templateColumns"];
}
export const PoolAssetsTableRow = ({
  templateColumns,
}: PoolAssetsTableRowProps) => {
  return (
    <Grid templateColumns={templateColumns}>
      <TableRow>dddd</TableRow>
      <TableRow>ddd</TableRow>
      <TableRow justifyContent="center">dddsdfs</TableRow>
      <TableRow>dd</TableRow>
      <TableRow>dd</TableRow>
      <TableRow>
        <Text color="text.dark">sddsds</Text>
      </TableRow>
      <TableRow>dddd</TableRow>
    </Grid>
  );
};
