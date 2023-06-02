import { Flex, Grid, Text } from "@chakra-ui/react";

import { TokenCell } from "../TokenCell";
import { TableRow } from "lib/components/table";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import type { TokenWithValue, ValidatorInfo } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

interface BondedInfo {
  validator: ValidatorInfo;
  amount: TokenWithValue;
  reward?: TokenWithValue;
  completionTime?: Date;
}

interface BondedTableRowProps {
  bondedInfo: BondedInfo;
  templateColumns: string;
}

export const BondedTableRow = ({
  bondedInfo,
  templateColumns,
}: BondedTableRowProps) => (
  <Grid
    templateColumns={templateColumns}
    _hover={{ bg: "gray.900" }}
    transition="all .25s ease-in-out"
    minW="min-content"
  >
    <TableRow>
      <ValidatorBadge validator={bondedInfo.validator} />
    </TableRow>
    <TableRow>
      <TokenCell token={bondedInfo.amount} />
    </TableRow>

    {bondedInfo.reward && (
      <TableRow>
        <TokenCell token={bondedInfo.reward} />
      </TableRow>
    )}
    {bondedInfo.completionTime && (
      <TableRow>
        <Flex direction="column">
          <Text variant="body2" color="text.dark">
            {formatUTC(bondedInfo.completionTime)}
          </Text>
          <Text variant="body3" color="text.disabled">
            {`(${dateFromNow(bondedInfo.completionTime)})`}
          </Text>
        </Flex>
      </TableRow>
    )}
  </Grid>
);
