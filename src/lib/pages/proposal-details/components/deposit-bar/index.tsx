import { Flex, Text } from "@chakra-ui/react";

import { mapDeposit } from "../../utils";
import type { ProposalData, TokenWithValue } from "lib/types";

import { DepositRatio } from "./DepositRatio";
import { ProgressBar } from "./ProgressBar";

interface DepositBarProps {
  deposit: ProposalData["totalDeposit"];
  isCompact: boolean;
  isDepositOrVoting: boolean;
  minDeposit: TokenWithValue[];
}

export const DepositBar = ({
  deposit,
  isCompact,
  isDepositOrVoting,
  minDeposit,
}: DepositBarProps) => {
  const pairDeposit = mapDeposit(deposit, minDeposit);
  return (
    <Flex gap="2px" ml={isCompact ? 0 : 2} w="full" direction="column">
      {pairDeposit.map(({ current, min }) => (
        <Flex
          key={min.denom}
          align="center"
          gap={isCompact ? 0 : 2}
          w="full"
          direction={isCompact ? "column" : "row"}
        >
          {isDepositOrVoting && (
            <ProgressBar
              max={min.amount}
              value={current.amount}
              isCompact={isCompact}
            />
          )}
          {isCompact ? (
            <Flex align="center" justify="space-between" w="full">
              <Text variant="body2" fontWeight={500} textColor="text.dark">
                Deposited
              </Text>
              <DepositRatio
                current={current}
                min={min}
                isCompact
                isDepositOrVoting={isDepositOrVoting}
              />
            </Flex>
          ) : (
            <DepositRatio
              current={current}
              min={min}
              isCompact={false}
              isDepositOrVoting={isDepositOrVoting}
            />
          )}
        </Flex>
      ))}
    </Flex>
  );
};
