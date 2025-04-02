import type { ProposalData, TokenWithValue } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";

import { mapDeposit } from "../../utils";
import { DepositRatio } from "./DepositRatio";
import { ProgressBar } from "./ProgressBar";

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
    <Flex direction="column" gap="2px" ml={isCompact ? 0 : 2} w="full">
      {pairDeposit.map(({ current, min }) => (
        <Flex
          key={min.denom}
          align="center"
          direction={isCompact ? "column" : "row"}
          gap={isCompact ? 0 : 2}
          w="full"
        >
          {isDepositOrVoting && (
            <ProgressBar
              isCompact={isCompact}
              max={min.amount}
              value={current.amount}
            />
          )}
          {isCompact ? (
            <Flex align="center" justify="space-between" w="full">
              <Text fontWeight={500} textColor="text.dark" variant="body2">
                Deposited
              </Text>
              <DepositRatio
                current={current}
                isCompact
                isDepositOrVoting={isDepositOrVoting}
                min={min}
              />
            </Flex>
          ) : (
            <DepositRatio
              current={current}
              isCompact={false}
              isDepositOrVoting={isDepositOrVoting}
              min={min}
            />
          )}
        </Flex>
      ))}
    </Flex>
  );
};
