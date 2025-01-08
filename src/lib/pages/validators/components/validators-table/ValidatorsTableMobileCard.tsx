import { Flex, Text } from "@chakra-ui/react";
import type Big from "big.js";

import { useInternalNavigate } from "lib/app-provider";
import { MobileCardTemplate, MobileLabel } from "lib/components/table";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import type {
  AssetInfo,
  Option,
  Ratio,
  Token,
  U,
  ValidatorData,
} from "lib/types";
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
      middleContent={
        <Flex gap={3}>
          <Flex flex={1} direction="column">
            <MobileLabel label="Voting Power" />
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
          </Flex>
          <Flex flex={1} direction="column">
            {showUptime ? (
              <>
                <MobileLabel label="Uptime" />
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
                <Text variant="body3" color="text.dark">
                  (Recent 100 blocks)
                </Text>
              </>
            ) : (
              <>
                <MobileLabel label="Commission" />
                <Text
                  variant="body2"
                  color={isMinCommissionRate ? "success.main" : "text.main"}
                  fontWeight={isMinCommissionRate ? 700 : undefined}
                >
                  {formatPrettyPercent(validator.commissionRate, 2, true)}
                </Text>
              </>
            )}
          </Flex>
        </Flex>
      }
      bottomContent={
        showUptime && (
          <Flex direction="column">
            <MobileLabel label="Commission" />
            <Text
              variant="body2"
              color={isMinCommissionRate ? "success.main" : "text.main"}
              fontWeight={isMinCommissionRate ? 700 : undefined}
            >
              {formatPrettyPercent(validator.commissionRate, 2, true)}
            </Text>
          </Flex>
        )
      }
      onClick={() =>
        navigate({
          pathname: "/validators/[validatorAddress]",
          query: { validatorAddress: validator.validatorAddress },
        })
      }
      topContent={
        <Flex gap={3} w="full">
          {isActive && (
            <Flex gap={1} w="64px" direction="column">
              <MobileLabel label="Rank" />
              <Flex alignItems="center" h="full">
                <Text variant="body2" color="text.main">
                  {validator.rank}
                </Text>
              </Flex>
            </Flex>
          )}
          <Flex gap={1} minW={0} direction="column">
            <MobileLabel label="Validator" />
            <ValidatorBadge
              validator={{
                identity: validator.identity,
                moniker: validator.moniker,
                validatorAddress: validator.validatorAddress,
              }}
              badgeSize={6}
              hasLabel={false}
            />
          </Flex>
        </Flex>
      }
    />
  );
};
