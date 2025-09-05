import type Big from "big.js";
import type { Option, Ratio, Token, U, USD } from "lib/types";

import { Box, Flex, Text } from "@chakra-ui/react";
import { useEvmConfig } from "lib/app-provider";
import { TokenImageRender } from "lib/components/token";
import { big } from "lib/types";
import {
  divWithDefault,
  formatRatio,
  formatUTokenWithPrecision,
  getTokenLabel,
} from "lib/utils";

import { getUndefinedTokenIcon } from "../../utils";

interface AllocationBadgeProps {
  amount: U<Token<Big>>;
  denom?: string;
  liquidity: USD<Big>;
  logo?: string;
  mode: string;
  precision?: number;
  symbol?: string;
  value: Option<USD<Big>>;
}

export const AllocationBadge = ({
  amount,
  denom,
  liquidity,
  logo,
  mode,
  precision,
  symbol,
  value,
}: AllocationBadgeProps) => {
  const evm = useEvmConfig({ shouldRedirect: false });
  const formattedValue = formatRatio(
    divWithDefault(value ?? big(0), liquidity, 0) as Ratio<Big>
  );
  const formattedAmount = denom
    ? formatUTokenWithPrecision({
        amount,
        isEvm: evm.enabled,
        precision: precision ?? 0,
      })
    : "-";
  return (
    <Flex
      alignItems="center"
      bg="gray.800"
      border="1px solid"
      borderColor="gray.700"
      borderRadius="8px"
      gap={2}
      px={3}
      py={1}
      transition="all 0.25s ease-in-out"
    >
      {denom && (
        <TokenImageRender
          boxSize={4}
          logo={logo ?? getUndefinedTokenIcon(denom)}
        />
      )}
      <Box minW="50px" w="full">
        <Text
          className="ellipsis"
          color="text.dark"
          fontWeight="600"
          variant="body3"
        >
          {denom ? getTokenLabel(denom, symbol) : "OTHERS"}
        </Text>
        <Text color="text.main" variant="body3">
          {mode === "percent-value"
            ? `${formattedValue}`
            : `${formattedAmount}`}
        </Text>
      </Box>
    </Flex>
  );
};
