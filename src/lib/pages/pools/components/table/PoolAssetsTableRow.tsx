import type { GridProps } from "@chakra-ui/react";
import { Flex, Skeleton, Grid, Image, Text } from "@chakra-ui/react";
import type { Big } from "big.js";

import { getUndefinedTokenIcon } from "../../utils";
import { TableRow } from "lib/components/table/tableComponents";
import { useAssetInfos } from "lib/services/assetService";
import type { USD, PoolDetail, TokenWithValue } from "lib/types";
import {
  d2Formatter,
  formatPrice,
  formatUTokenWithPrecision,
  getTokenLabel,
} from "lib/utils";

interface PoolAssetsTableRowProps {
  pool_type: PoolDetail["type"];
  asset: TokenWithValue;
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

  return (
    <Grid templateColumns={templateColumns}>
      <TableRow>
        <Flex alignItems="center" gap={2}>
          <Image
            boxSize={7}
            src={asset.logo || getUndefinedTokenIcon(asset.denom)}
          />
          <Flex flexDirection="column">
            <Text variant="body2" fontWeight="600" color="text.main">
              {asset.symbol || getTokenLabel(asset.denom)}
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
        </Flex>
      </TableRow>
      <TableRow>
        <Flex alignItems="flex-end" w="full" flexDirection="column">
          <Text variant="body2" fontWeight="600" color="text.main">
            {formatUTokenWithPrecision(
              asset.amount,
              assetInfo.precision,
              false
            )}
          </Text>
          <Text variant="body3" color="text.dark">
            {asset.value?.toString() ?? 0}
          </Text>
        </Flex>
      </TableRow>
    </Grid>
  );
};
