import { Flex, Text } from "@chakra-ui/react";

import { TokenImageRender } from "lib/components/token";
import type { ProposalDeposit } from "lib/types";
import { formatUTokenWithPrecision, getTokenLabel } from "lib/utils";

interface DepositAmountsProps {
  deposit: ProposalDeposit;
}

export const DepositAmounts = ({ deposit }: DepositAmountsProps) => (
  <div>
    {deposit.amount.length === 0 ? (
      <Text px={4} variant="body2" color="text.dark">
        -
      </Text>
    ) : (
      deposit.amount.map((token) => (
        <Flex key={token.denom} alignItems="center" gap={2}>
          <Text variant="body2">
            <Text as="span" mr={1} fontWeight={700}>
              {formatUTokenWithPrecision(
                token.amount,
                token.precision ?? 0,
                true,
                2
              )}
            </Text>
            {getTokenLabel(token.denom, token.symbol)}
          </Text>
          <TokenImageRender logo={token.logo} />
        </Flex>
      ))
    )}
  </div>
);
