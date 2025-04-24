import type { NonRedelegatable } from "lib/types";

import { Flex, Grid, Text } from "@chakra-ui/react";
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
    minW="min-content"
    templateColumns={templateColumns}
    transition="all 0.25s ease-in-out"
  >
    <TableRow>
      <ValidatorBadge validator={nonRedelegatable.dstValidator} />
    </TableRow>

    <TableRow>
      <Flex color="text.dark" direction="column" gap={1}>
        <Text color="text.dark" variant="body2">
          {formatUTC(nonRedelegatable.completionTime)}
        </Text>
        <Text color="text.disabled" variant="body3">
          {`(${dateFromNow(nonRedelegatable.completionTime)})`}
        </Text>
      </Flex>
    </TableRow>
  </Grid>
);
