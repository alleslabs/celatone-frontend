import type { GridProps } from "@chakra-ui/react";
import { Grid, Text } from "@chakra-ui/react";
import type Big from "big.js";

import { useInternalNavigate } from "lib/app-provider";
import { TableRow } from "lib/components/table";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import type {
  AssetInfo,
  Option,
  Ratio,
  Token,
  U,
  ValidatorAddr,
  ValidatorData,
} from "lib/types";
import {
  divWithDefault,
  formatPrettyPercent,
  formatUTokenWithPrecision,
  getTokenLabel,
} from "lib/utils";

interface ValidatorsTableRowProps {
  assetInfo: Option<AssetInfo>;
  isActive: boolean;
  minCommissionRate: number;
  showUptime: boolean;
  templateColumns: GridProps["templateColumns"];
  totalVotingPower: Big;
  validator: ValidatorData;
}

export const ValidatorsTableRow = ({
  assetInfo,
  isActive,
  minCommissionRate,
  showUptime,
  templateColumns,
  totalVotingPower,
  validator,
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
      onClick={() => onRowSelect(validator.validatorAddress)}
      templateColumns={templateColumns}
      transition="all 0.25s ease-in-out"
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
            identity: validator.identity,
            moniker: validator.moniker,
            validatorAddress: validator.validatorAddress,
          }}
          badgeSize={7}
        />
      </TableRow>
      <TableRow>
        <div>
          <Text variant="body2" color="text.main">
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
          <Text variant="body3" color="text.dark">
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
      )}
      <TableRow>
        <Text
          variant="body2"
          color={isMinCommissionRate ? "success.main" : "text.main"}
          fontWeight={isMinCommissionRate ? 700 : undefined}
        >
          {formatPrettyPercent(validator.commissionRate, 2, true)}
        </Text>
      </TableRow>
    </Grid>
  );
};
