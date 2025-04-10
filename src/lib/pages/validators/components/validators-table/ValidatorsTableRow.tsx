import type { GridProps } from "@chakra-ui/react";
import type Big from "big.js";
import type {
  AssetInfo,
  Option,
  Ratio,
  Token,
  U,
  ValidatorAddr,
  ValidatorData,
} from "lib/types";

import { Grid, Text } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { TableRow } from "lib/components/table";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import {
  divWithDefault,
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
  assetInfo: Option<AssetInfo>;
  showUptime: boolean;
}

export const ValidatorsTableRow = ({
  templateColumns,
  isActive,
  validator,
  totalVotingPower,
  minCommissionRate,
  assetInfo,
  showUptime,
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
      className="copier-wrapper"
      _hover={{ bg: "gray.900" }}
      cursor="pointer"
      templateColumns={templateColumns}
      transition="all 0.25s ease-in-out"
      onClick={() => onRowSelect(validator.validatorAddress)}
    >
      {isActive && (
        <TableRow justifyContent="center">
          <Text color="text.main" variant="body3">
            {validator.rank}
          </Text>
        </TableRow>
      )}
      <TableRow>
        <ValidatorBadge
          badgeSize={7}
          validator={{
            validatorAddress: validator.validatorAddress,
            identity: validator.identity,
            moniker: validator.moniker,
          }}
        />
      </TableRow>
      <TableRow>
        <div>
          <Text color="text.main" variant="body2">
            {formatPrettyPercent(
              divWithDefault(
                validator.votingPower,
                totalVotingPower,
                0
              ).toNumber() as Ratio<number>,
              2,
              true
            )}
          </Text>
          <Text color="text.dark" variant="body3">
            (
            {formatUTokenWithPrecision(
              validator.votingPower as U<Token<Big>>,
              assetInfo?.precision ?? 0,
              false,
              2
            )}
            {assetInfo?.id
              ? ` ${getTokenLabel(assetInfo.id, assetInfo.symbol)}`
              : undefined}
            )
          </Text>
        </div>
      </TableRow>
      {showUptime && (
        <TableRow>
          <Text
            color={isZeroUptime ? "error.main" : "text.main"}
            fontWeight={isZeroUptime ? 700 : undefined}
            variant="body2"
          >
            {formatPrettyPercent(
              ((validator.uptime ?? 0) / 100) as Ratio<number>,
              0,
              true
            )}
          </Text>
        </TableRow>
      )}
      <TableRow>
        <Text
          color={isMinCommissionRate ? "success.main" : "text.main"}
          fontWeight={isMinCommissionRate ? 700 : undefined}
          variant="body2"
        >
          {formatPrettyPercent(validator.commissionRate, 2, true)}
        </Text>
      </TableRow>
    </Grid>
  );
};
