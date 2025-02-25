import { Flex, Text } from "@chakra-ui/react";

import type { ProposalData, TokenWithValue } from "lib/types";

import { DepositRatio } from "./DepositRatio";
import { ProgressBar } from "./ProgressBar";
import { mapDeposit } from "../../utils";

interface DepositBarProps {
  deposit: ProposalData["totalDeposit"];
  minDeposit: TokenWithValue[];
  isDepositOrVoting: boolean;
  isCompact: boolean;
}

export const DepositBar = ({
  deposit,
  minDeposit,
  isDepositOrVoting,
  isCompact,
}: DepositBarProps) => {
  const pairDeposit = mapDeposit(deposit, minDeposit);
  return (
    <Flex direction="column" ml={isCompact ? 0 : 2} gap="2px" w="full">
      {pairDeposit.map(({ current, min }) => (
        <Flex
          key={min.denom}
          direction={isCompact ? "column" : "row"}
          align="center"
          w="full"
          gap={isCompact ? 0 : 2}
        >
          {isDepositOrVoting && (
            <ProgressBar
              value={current.amount}
              max={min.amount}
              isCompact={isCompact}
            />
          )}
          {isCompact ? (
            <Flex align="center" w="full" justify="space-between">
              <Text variant="body2" textColor="text.dark" fontWeight={500}>
                Deposited
              </Text>
              <DepositRatio
                current={current}
                min={min}
                isDepositOrVoting={isDepositOrVoting}
                isCompact
              />
            </Flex>
          ) : (
            <DepositRatio
              current={current}
              min={min}
              isDepositOrVoting={isDepositOrVoting}
              isCompact={false}
            />
          )}
        </Flex>
      ))}
    </Flex>
  );
};
