import { Flex, Grid, Text } from "@chakra-ui/react";

import { ValidatorBadge } from "../../ValidatorBadge";
import { TableRow } from "../tableComponents";
import { TokenCell } from "../TokenCell";
import { CustomIcon } from "lib/components/icon";
import type { Redelegation } from "lib/types";
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
    minW="min-content"
    sx={{ "& > div": { alignItems: "flex-start" } }}
    _hover={{ bg: "gray.900" }}
    templateColumns={templateColumns}
    transition="all 0.25s ease-in-out"
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
    <TableRow alignItems="start" gap={2} flexDirection="column">
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
