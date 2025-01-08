import { Box, Flex, Text } from "@chakra-ui/react";
import type Big from "big.js";

import { getUndefinedTokenIcon } from "../../utils";
import { TokenImageRender } from "lib/components/token";
import { big } from "lib/types";
import type { Option, Ratio, Token, U, USD } from "lib/types";
import {
  divWithDefault,
  formatRatio,
  formatUTokenWithPrecision,
  getTokenLabel,
} from "lib/utils";

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
  const formattedValue = formatRatio(
    divWithDefault(value ?? big(0), liquidity, 0) as Ratio<Big>
  );
  const formattedAmount = denom
    ? formatUTokenWithPrecision(amount, precision ?? 0)
    : "-";
  return (
    <Flex
      alignItems="center"
      bg="gray.800"
      gap={2}
      px={3}
      py={1}
      border="1px solid"
      borderColor="gray.700"
      borderRadius="8px"
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
          variant="body3"
          color="text.dark"
          fontWeight="600"
        >
          {denom ? getTokenLabel(denom, symbol) : "OTHERS"}
        </Text>
        <Text variant="body3" color="text.main">
          {mode === "percent-value"
            ? `${formattedValue}`
            : `${formattedAmount}`}
        </Text>
      </Box>
    </Flex>
  );
};
