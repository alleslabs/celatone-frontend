import { Flex, Grid, Text } from "@chakra-ui/react";

import { ValidatorBadge } from "../../ValidatorBadge";
import { TableRow } from "../tableComponents";
import type { TokenWithValue, Validator } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

import { TokensCell } from "./TokensCell";

export interface BondedInfo {
  balances: TokenWithValue[];
  completionTime?: Date;
  rewards?: TokenWithValue[];
  validator: Validator;
}

interface BondedTableRowProps {
  bondedInfo: BondedInfo;
  isSingleBondDenom: boolean;
  isUnbonding?: boolean;
  templateColumns: string;
}

export const BondedTableRow = ({
  bondedInfo,
  isSingleBondDenom,
  isUnbonding,
  templateColumns,
}: BondedTableRowProps) => (
  <Grid
    minW="min-content"
    sx={{ "& > div": { alignItems: "flex-start" } }}
    _hover={{ bg: "gray.900" }}
    templateColumns={templateColumns}
    transition="all 0.25s ease-in-out"
  >
    <TableRow>
      <ValidatorBadge validator={bondedInfo.validator} />
    </TableRow>
    <TableRow>
      <TokensCell
        isSingleBondDenom={isSingleBondDenom}
        isUnbonding={isUnbonding}
        tokens={bondedInfo.balances}
      />
    </TableRow>

    {bondedInfo.rewards && (
      <TableRow>
        <TokensCell
          isSingleBondDenom={isSingleBondDenom}
          isUnbonding={isUnbonding}
          tokens={bondedInfo.rewards}
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
