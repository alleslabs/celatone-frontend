import type { GridProps } from "@chakra-ui/react";
import { Flex, Skeleton, Grid, Image, Text } from "@chakra-ui/react";
import big from "big.js";
import type { BigSource, Big } from "big.js";

import { UndefinedTokenList } from "../constant";
import { TableRow } from "lib/components/table/tableComponents";
import { useAssetInfos } from "lib/services/assetService";
import type { Token, U, PoolLiquidity, USD, PoolDetail } from "lib/types";
import {
  calculateAssetValue,
  d2Formatter,
  formatPrice,
  formatUTokenWithPrecision,
  getTokenLabel,
  toToken,
} from "lib/utils";

interface PoolAssetsTableRowProps {
  pool_type: PoolDetail["pool_type"];
  asset: PoolLiquidity;
  templateColumns: GridProps["templateColumns"];
  total_liquidity: USD<Big>;
}

export const PoolAssetsTableRow = ({
  pool_type,
  asset,
  templateColumns,
  total_liquidity,
}: PoolAssetsTableRowProps) => {
  const { assetInfos } = useAssetInfos();
  if (!assetInfos)
    return (
      <Skeleton height="75px" startColor="pebble.900" endColor="pebble.800" />
    );
  const assetInfo = assetInfos[asset.denom];
  const assetValue = calculateAssetValue(
    toToken(big(asset.amount) as U<Token<BigSource>>, assetInfo.precision),
    assetInfo.price as USD<number>
  );
  return (
    <Grid templateColumns={templateColumns}>
      <TableRow>
        <Flex alignItems="center" gap={2}>
          <Image boxSize={7} src={assetInfo.logo || UndefinedTokenList[0]} />
          <Flex flexDirection="column">
            <Text variant="body2" fontWeight="600" color="text.main">
              {assetInfo?.symbol || getTokenLabel(asset.denom)}
            </Text>
            <Text variant="body3" color="text.dark">
              {formatPrice(assetInfo.price as USD<number>)}
            </Text>
          </Flex>
        </Flex>
      </TableRow>
      <TableRow>
        {pool_type === "Stableswap" ? (
          <Flex justifyContent="right" w="full">
            stable scaling
          </Flex>
        ) : (
          <Flex justifyContent="right" w="full">
            balancer weight
          </Flex>
        )}
      </TableRow>

      <TableRow>
        <Flex justifyContent="right" w="full">
          {d2Formatter(total_liquidity, "0.00")}
          {/* {big(total_liquidity).div(1000)} */}
          {/* {formatPrice(total_liquidity)} */}
        </Flex>
      </TableRow>
      <TableRow>
        <Flex alignItems="flex-end" w="full" flexDirection="column">
          <Text variant="body2" fontWeight="600" color="text.main">
            {formatUTokenWithPrecision(
              asset.amount as U<Token>,
              assetInfo.precision,
              false
            )}
          </Text>
          <Text variant="body3" color="text.dark">
            {formatPrice(assetValue)}
          </Text>
        </Flex>
      </TableRow>
    </Grid>
  );
};
