import type { GridProps } from "@chakra-ui/react";
import { Grid, Text } from "@chakra-ui/react";
import type Big from "big.js";

import { useInternalNavigate } from "lib/app-provider";
import { TableRow } from "lib/components/table";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import type {
  Option,
  Ratio,
  Token,
  TokenWithValue,
  U,
  ValidatorAddr,
  ValidatorData,
} from "lib/types";
import {
  formatPrettyPercent,
  formatUTokenWithPrecision,
  getTokenLabel,
} from "lib/utils";

interface ValidatorsTableRowProps {
  templateColumns: GridProps["templateColumns"];
  isActive: boolean;
  validator: ValidatorData;
  totalVotingPower: Big;
  minCommissionRate: number;
  denomToken: Option<TokenWithValue>;
}

export const ValidatorsTableRow = ({
  templateColumns,
  isActive,
  validator,
  totalVotingPower,
  minCommissionRate,
  denomToken,
}: ValidatorsTableRowProps) => {
  const navigate = useInternalNavigate();

  const onRowSelect = (validatorAddress: ValidatorAddr) =>
    navigate({
      pathname: "/validators/[validatorAddress]",
      query: { validatorAddress },
    });

  const isZeroUptime = !validator.uptime;
  const isMinCommissionRate = minCommissionRate === validator.commissionRate;
  return (
    <Grid
      templateColumns={templateColumns}
      onClick={() => onRowSelect(validator.validatorAddress)}
      _hover={{ bg: "gray.900" }}
      transition="all 0.25s ease-in-out"
      cursor="pointer"
    >
      {isActive && (
        <TableRow justifyContent="center">
          <Text variant="body3" color="text.main">
            {validator.rank}
          </Text>
        </TableRow>
      )}
      <TableRow>
        <ValidatorBadge
          validator={{
            validatorAddress: validator.validatorAddress,
            identity: validator.identity,
            moniker: validator.moniker,
          }}
          badgeSize={7}
          maxWidth="220px"
        />
      </TableRow>
      <TableRow>
        <div>
          <Text variant="body2" color="text.main">
            {formatPrettyPercent(
              validator.votingPower
                .div(totalVotingPower)
                .toNumber() as Ratio<number>,
              2,
              true
            )}
          </Text>
          <Text variant="body3" color="text.dark">
            (
            {formatUTokenWithPrecision(
              validator.votingPower as U<Token<Big>>,
              denomToken?.precision ?? 0,
              false,
              2
            )}
            {denomToken
              ? ` ${getTokenLabel(denomToken.denom, denomToken.symbol)}`
              : undefined}
            )
          </Text>
        </div>
      </TableRow>
      <TableRow>
        <Text
          variant="body2"
          color={isZeroUptime ? "error.main" : "text.main"}
          fontWeight={isZeroUptime ? 700 : undefined}
        >
          {formatPrettyPercent(
            ((validator.uptime ?? 0) / 100) as Ratio<number>,
            0,
            true
          )}
        </Text>
      </TableRow>
      <TableRow>
        <Text
          variant="body2"
          color={isMinCommissionRate ? "success.main" : "text.main"}
          fontWeight={isMinCommissionRate ? 700 : undefined}
        >
          {formatPrettyPercent(
            validator.commissionRate as Ratio<number>,
            2,
            true
          )}
        </Text>
      </TableRow>
    </Grid>
  );
};
