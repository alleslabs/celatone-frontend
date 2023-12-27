import { Flex, Grid, Text } from "@chakra-ui/react";

import { TokenCell } from "../TokenCell";
import { CustomIcon } from "lib/components/icon";
import { TableRow } from "lib/components/table";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import type { Redelegation } from "lib/pages/account-details/types";
import { dateFromNow, formatUTC } from "lib/utils";

interface RedelegationTableRowProps {
  redelegation: Redelegation;
  templateColumns: string;
}

export const RedelegationTableRow = ({
  redelegation,
  templateColumns,
}: RedelegationTableRowProps) => (
  <Grid
    templateColumns={templateColumns}
    _hover={{ bg: "gray.900" }}
    transition="all 0.25s ease-in-out"
    minW="min-content"
    sx={{ "& > div": { alignItems: "flex-start" } }}
  >
    <TableRow>
      <ValidatorBadge validator={redelegation.srcValidator} />
    </TableRow>
    <TableRow>
      <CustomIcon name="arrow-right" boxSize={6} color="gray.600" />
    </TableRow>
    <TableRow>
      <ValidatorBadge validator={redelegation.dstValidator} />
    </TableRow>
    <TableRow flexDirection="column" alignItems="start" gap={2}>
      {redelegation.balances.map((balance) => (
        <TokenCell key={balance.denom} token={balance} />
      ))}
    </TableRow>
    <TableRow>
      <Flex direction="column">
        <Text variant="body2" color="text.dark">
          {formatUTC(redelegation.completionTime)}
        </Text>
        <Text variant="body3" color="text.disabled">
          {`(${dateFromNow(redelegation.completionTime)})`}
        </Text>
      </Flex>
    </TableRow>
  </Grid>
);
