import { Flex, Grid, Text } from "@chakra-ui/react";

import { TableRow } from "lib/components/table";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import type { TokenWithValue, ValidatorInfo } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

import { TokensCell } from "./TokensCell";

export interface BondedInfo {
  validator: ValidatorInfo;
  balances: TokenWithValue[];
  rewards?: TokenWithValue[];
  completionTime?: Date;
}

interface BondedTableRowProps {
  bondedInfo: BondedInfo;
  isSingleBondDenom: boolean;
  templateColumns: string;
}

export const BondedTableRow = ({
  bondedInfo,
  isSingleBondDenom,
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
      <TokensCell
        tokens={bondedInfo.balances}
        isSingleBondDenom={isSingleBondDenom}
      />
    </TableRow>

    {bondedInfo.rewards && (
      <TableRow>
        <TokensCell
          tokens={bondedInfo.rewards}
          isSingleBondDenom={isSingleBondDenom}
        />
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
