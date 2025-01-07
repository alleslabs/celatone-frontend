import { Flex, Grid, Text } from "@chakra-ui/react";

import { ValidatorBadge } from "../../ValidatorBadge";
import { TableRow } from "../tableComponents";
import type { NonRedelegatable } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

interface NonRedelegatableTableRowProps {
  nonRedelegatable: NonRedelegatable;
  templateColumns: string;
}

export const NonRedelegatableTableRow = ({
  nonRedelegatable,
  templateColumns,
}: NonRedelegatableTableRowProps) => (
  <Grid
    minW="min-content"
    templateColumns={templateColumns}
    transition="all 0.25s ease-in-out"
  >
    <TableRow>
      <ValidatorBadge validator={nonRedelegatable.dstValidator} />
    </TableRow>

    <TableRow>
      <Flex gap={1} color="text.dark" direction="column">
        <Text variant="body2" color="text.dark">
          {formatUTC(nonRedelegatable.completionTime)}
        </Text>
        <Text variant="body3" color="text.disabled">
          {`(${dateFromNow(nonRedelegatable.completionTime)})`}
        </Text>
      </Flex>
    </TableRow>
  </Grid>
);
