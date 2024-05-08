import { Flex, Text } from "@chakra-ui/react";

import { mapDeposit } from "../../utils";
import type { ProposalData, TokenWithValue } from "lib/types";

import { DepositRatio } from "./DepositRatio";
import { ProgressBar } from "./ProgressBar";

interface DepositBarProps {
  deposit: ProposalData["totalDeposit"];
  minDeposit: TokenWithValue[];
  isCompact: boolean;
}

export const DepositBar = ({
  deposit,
  minDeposit,
  isCompact,
}: DepositBarProps) => {
  const pairDeposit = mapDeposit(deposit, minDeposit);
  return (
    <Flex direction="column" gap="2px" w="full">
      {pairDeposit.map(({ current, min }) => (
        <Flex
          key={min.denom}
          direction={isCompact ? "column" : "row"}
          w="full"
          gap={isCompact ? 0 : 2}
        >
          <ProgressBar
            value={current.amount}
            max={min.amount}
            isCompact={isCompact}
          />
          {isCompact ? (
            <Flex align="center" justify="space-between">
              <Text variant="body2" textColor="text.dark" fontWeight={500}>
                Deposited
              </Text>
              <DepositRatio current={current} min={min} isCompact />
            </Flex>
          ) : (
            <DepositRatio current={current} min={min} isCompact={false} />
          )}
        </Flex>
      ))}
    </Flex>
  );
};
