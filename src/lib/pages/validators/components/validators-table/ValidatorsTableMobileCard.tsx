import type Big from "big.js";
import type {
  AssetInfo,
  Option,
  Ratio,
  Token,
  U,
  ValidatorData,
} from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { MobileCardTemplate, MobileLabel } from "lib/components/table";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import {
  divWithDefault,
  formatPrettyPercent,
  formatUTokenWithPrecision,
  getTokenLabel,
} from "lib/utils";

interface ValidatorsTableMobileCardProps {
  assetInfo: Option<AssetInfo>;
  isActive: boolean;
  minCommissionRate: number;
  showUptime: boolean;
  totalVotingPower: Big;
  validator: ValidatorData;
}
export const ValidatorsTableMobileCard = ({
  assetInfo,
  isActive,
  minCommissionRate,
  showUptime,
  totalVotingPower,
  validator,
}: ValidatorsTableMobileCardProps) => {
  const navigate = useInternalNavigate();
  const isZeroUptime = !validator.uptime;
  const isMinCommissionRate = minCommissionRate === validator.commissionRate;
  return (
    <MobileCardTemplate
      bottomContent={
        showUptime && (
          <Flex direction="column">
            <MobileLabel label="Commission" />
            <Text
              color={isMinCommissionRate ? "success.main" : "text.main"}
              fontWeight={isMinCommissionRate ? 700 : undefined}
              variant="body2"
            >
              {formatPrettyPercent(validator.commissionRate, 2, true)}
            </Text>
          </Flex>
        )
      }
      middleContent={
        <Flex gap={3}>
          <Flex direction="column" flex={1}>
            <MobileLabel label="Voting power" />
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
              {formatUTokenWithPrecision({
                amount: validator.votingPower as U<Token<Big>>,
                decimalPoints: 2,
                isSuffix: false,
                precision: assetInfo?.precision ?? 0,
              })}
              {assetInfo?.id
                ? ` ${getTokenLabel(assetInfo.id, assetInfo.symbol)}`
                : undefined}
              )
            </Text>
          </Flex>
          <Flex direction="column" flex={1}>
            {showUptime ? (
              <>
                <MobileLabel label="Uptime" />
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
                <Text color="text.dark" variant="body3">
                  (Recent 100 blocks)
                </Text>
              </>
            ) : (
              <>
                <MobileLabel label="Commission" />
                <Text
                  color={isMinCommissionRate ? "success.main" : "text.main"}
                  fontWeight={isMinCommissionRate ? 700 : undefined}
                  variant="body2"
                >
                  {formatPrettyPercent(validator.commissionRate, 2, true)}
                </Text>
              </>
            )}
          </Flex>
        </Flex>
      }
      topContent={
        <Flex gap={3} w="full">
          {isActive && (
            <Flex direction="column" gap={1} w="64px">
              <MobileLabel label="Rank" />
              <Flex alignItems="center" h="full">
                <Text color="text.main" variant="body2">
                  {validator.rank}
                </Text>
              </Flex>
            </Flex>
          )}
          <Flex direction="column" gap={1} minW={0}>
            <MobileLabel label="Validator" />
            <ValidatorBadge
              badgeSize={6}
              hasLabel={false}
              validator={{
                identity: validator.identity,
                moniker: validator.moniker,
                validatorAddress: validator.validatorAddress,
              }}
            />
          </Flex>
        </Flex>
      }
      onClick={() =>
        navigate({
          pathname: "/validators/[validatorAddress]",
          query: { validatorAddress: validator.validatorAddress },
        })
      }
    />
  );
};
