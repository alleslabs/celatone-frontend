import { Flex, Text } from "@chakra-ui/react";
import type Big from "big.js";

import { useInternalNavigate } from "lib/app-provider";
import { MobileCardTemplate, MobileLabel } from "lib/components/table";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import type {
  Option,
  Ratio,
  Token,
  TokenWithValue,
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
  validator: ValidatorData;
  isActive: boolean;
  totalVotingPower: Big;
  minCommissionRate: number;
  denomToken: Option<TokenWithValue>;
}
export const ValidatorsTableMobileCard = ({
  validator,
  isActive,
  totalVotingPower,
  minCommissionRate,
  denomToken,
}: ValidatorsTableMobileCardProps) => {
  const navigate = useInternalNavigate();

  const isZeroUptime = !validator.uptime;
  const isMinCommissionRate = minCommissionRate === validator.commissionRate;
  return (
    <MobileCardTemplate
      onClick={() =>
        navigate({
          pathname: "/blocks/[validatorAddress]",
          query: { validatorAddress: validator.validatorAddress },
        })
      }
      topContent={
        <Flex gap={3} w="full">
          {isActive && (
            <Flex direction="column" gap={1} w="64px">
              <MobileLabel label="Rank" />
              <Flex alignItems="center" h="full">
                <Text variant="body2" color="text.main">
                  {validator.rank}
                </Text>
              </Flex>
            </Flex>
          )}
          <Flex direction="column" gap={1}>
            <MobileLabel label="Validator" />
            <ValidatorBadge
              validator={{
                validatorAddress: validator.validatorAddress,
                identity: validator.identity,
                moniker: validator.moniker,
              }}
              badgeSize={6}
              hasLabel={false}
            />
          </Flex>
        </Flex>
      }
      middleContent={
        <Flex direction="column" gap={3}>
          <Flex gap={3} w="full">
            <Flex direction="column" flex="1">
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
                  denomToken?.precision ?? 0,
                  false,
                  2
                )}
                {denomToken
                  ? ` ${getTokenLabel(denomToken.denom, denomToken.symbol)}`
                  : undefined}
                )
              </Text>
            </Flex>
            <Flex direction="column" flex="1">
              <MobileLabel label="Uptime (100B)" />
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
            </Flex>
          </Flex>
          <Flex direction="column" flex="1">
            <MobileLabel label="Commission" />
            <Text
              variant="body2"
              color={isMinCommissionRate ? "success.main" : "text.main"}
              fontWeight={isMinCommissionRate ? 700 : undefined}
            >
              {formatPrettyPercent(validator.commissionRate, 2, true)}
            </Text>
          </Flex>
        </Flex>
      }
    />
  );
};
