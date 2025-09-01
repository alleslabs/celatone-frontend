import type { ProposalDeposit } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { useEvmConfig } from "lib/app-provider";
import { TokenImageRender } from "lib/components/token";
import { formatUTokenWithPrecision, getTokenLabel } from "lib/utils";

interface DepositAmountsProps {
  deposit: ProposalDeposit;
}

export const DepositAmounts = ({ deposit }: DepositAmountsProps) => {
  const evm = useEvmConfig({ shouldRedirect: false });

  return (
    <div>
      {deposit.amount.length === 0 ? (
        <Text color="text.dark" px={4} variant="body2">
          -
        </Text>
      ) : (
        deposit.amount.map((token) => (
          <Flex key={token.denom} alignItems="center" gap={2}>
            <Text variant="body2">
              <Text as="span" fontWeight={700} mr={1}>
                {formatUTokenWithPrecision({
                  amount: token.amount,
                  decimalPoints: 2,
                  isEvm: evm.enabled,
                  isSuffix: true,
                  precision: token.precision ?? 0,
                })}
              </Text>
              {getTokenLabel(token.denom, token.symbol)}
            </Text>
            <TokenImageRender logo={token.logo} />
          </Flex>
        ))
      )}
    </div>
  );
};
