import { Box, Flex, Text } from "@chakra-ui/react";
import type { BigSource } from "big.js";

import { TokenImageRender } from "lib/components/token";
import { getUndefinedTokenIcon } from "lib/pages/pools/utils";
import type { AssetInfos, Coin, Option, USD } from "lib/types";
import {
  coinToTokenWithValue,
  formatPrice,
  formatUTokenWithPrecision,
} from "lib/utils";

interface RelatedTransactionsBondedTokenChangesProps {
  txHash: string;
  token: Coin;
  assetInfos: Option<AssetInfos>;
}

export const RelatedTransactionsBondedTokenChanges = ({
  txHash,
  token,
  assetInfos,
}: RelatedTransactionsBondedTokenChangesProps) => {
  const tokenWithValue = coinToTokenWithValue(
    token?.denom,
    token?.amount,
    assetInfos
  );

  const formattedAmount = formatUTokenWithPrecision(
    tokenWithValue.amount,
    tokenWithValue.precision ?? 0,
    false,
    2,
    true
  );

  const isPositiveAmount = tokenWithValue.amount.gte(0);

  return (
    <Flex
      gap={2}
      key={`${txHash}-${token.denom}`}
      w="100%"
      justifyContent={{ base: "start", md: "end" }}
      alignItems="center"
    >
      <Box textAlign={{ base: "left", md: "right" }}>
        <Text>
          <Text
            as="span"
            fontWeight={700}
            color={isPositiveAmount ? "success.main" : "error.main"}
          >
            {formattedAmount}
          </Text>{" "}
          {tokenWithValue.symbol}
        </Text>
        <Text variant="body3" color="text.dark">
          ({formatPrice(tokenWithValue.value?.abs() as USD<BigSource>)})
        </Text>
      </Box>
      <TokenImageRender
        boxSize={6}
        logo={
          tokenWithValue.logo ?? getUndefinedTokenIcon(tokenWithValue.denom)
        }
      />
    </Flex>
  );
};
