import type { Redelegation } from "lib/types";

import { Flex, Grid, Text } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";
import { dateFromNow, formatUTC } from "lib/utils";

import { ValidatorBadge } from "../../ValidatorBadge";
import { TableRow } from "../tableComponents";
import { TokenCell } from "../TokenCell";

interface RedelegationTableRowProps {
  redelegation: Redelegation;
  templateColumns: string;
}

export const RedelegationTableRow = ({
  redelegation,
  templateColumns,
}: RedelegationTableRowProps) => (
  <Grid
    _hover={{ bg: "gray.900" }}
    minW="min-content"
    sx={{ "& > div": { alignItems: "flex-start" } }}
    templateColumns={templateColumns}
    transition="all 0.25s ease-in-out"
  >
    <TableRow>
      <ValidatorBadge validator={redelegation.srcValidator} />
    </TableRow>
    <TableRow>
      <CustomIcon boxSize={6} color="gray.600" name="arrow-right" />
    </TableRow>
    <TableRow>
      <ValidatorBadge validator={redelegation.dstValidator} />
    </TableRow>
    <TableRow alignItems="start" flexDirection="column" gap={2}>
      {redelegation.balances.map((balance) => (
        <TokenCell key={balance.denom} token={balance} />
      ))}
    </TableRow>
    <TableRow>
      <Flex direction="column">
        <Text color="text.dark" variant="body2">
          {formatUTC(redelegation.completionTime)}
        </Text>
        <Text color="text.disabled" variant="body3">
          {`(${dateFromNow(redelegation.completionTime)})`}
        </Text>
      </Flex>
    </TableRow>
  </Grid>
);
