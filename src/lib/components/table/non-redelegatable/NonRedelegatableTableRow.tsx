import { Flex, Grid, Text } from "@chakra-ui/react";

import type { NonRedelegatable } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";
import { ValidatorBadge } from "../../ValidatorBadge";
import { TableRow } from "../tableComponents";

interface NonRedelegatableTableRowProps {
  nonRedelegatable: NonRedelegatable;
  templateColumns: string;
}

export const NonRedelegatableTableRow = ({
  nonRedelegatable,
  templateColumns,
}: NonRedelegatableTableRowProps) => (
  <Grid
    templateColumns={templateColumns}
    transition="all 0.25s ease-in-out"
    minW="min-content"
  >
    <TableRow>
      <ValidatorBadge validator={nonRedelegatable.dstValidator} />
    </TableRow>

    <TableRow>
      <Flex direction="column" gap={1} color="text.dark">
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
