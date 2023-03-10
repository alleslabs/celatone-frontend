import { Flex, Grid, Text } from "@chakra-ui/react";

import { TableRow, ValidatorBadge } from "lib/components/table";
import type { NonRedelegatable } from "lib/pages/account-details/type";
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
    templateColumns={templateColumns}
    transition="all .25s ease-in-out"
    minW="min-content"
  >
    <TableRow>
      <ValidatorBadge validator={nonRedelegatable.validator} />
    </TableRow>

    <TableRow>
      <Flex direction="column" gap={1} color="text.dark">
        <Text variant="body2">
          {formatUTC(nonRedelegatable.completionTime)}
        </Text>
        <Text variant="body3" color="text.disabled">
          {`(${dateFromNow(nonRedelegatable.completionTime)})`}
        </Text>
      </Flex>
    </TableRow>
  </Grid>
);
