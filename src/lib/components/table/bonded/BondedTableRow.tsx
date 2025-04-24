import type { TokenWithValue, Validator } from "lib/types";

import { Flex, Grid, Text } from "@chakra-ui/react";
import { dateFromNow, formatUTC } from "lib/utils";

import { ValidatorBadge } from "../../ValidatorBadge";
import { TableRow } from "../tableComponents";
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
    _hover={{ bg: "gray.900" }}
    minW="min-content"
    sx={{ "& > div": { alignItems: "flex-start" } }}
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
          <Text color="text.dark" variant="body2">
            {formatUTC(bondedInfo.completionTime)}
          </Text>
          <Text color="text.disabled" variant="body3">
            {`(${dateFromNow(bondedInfo.completionTime)})`}
          </Text>
        </Flex>
      </TableRow>
    )}
  </Grid>
);
