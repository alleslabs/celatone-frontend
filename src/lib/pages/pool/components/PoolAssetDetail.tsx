import { Flex, Heading, Badge, Text, Box } from "@chakra-ui/react";
import type { Big } from "big.js";
import big from "big.js";
import Link from "next/link";

import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { useAssetInfos } from "lib/services/assetService";
import type { USD } from "lib/types";
import type { PoolLiquidity } from "lib/types/pool";
import { calAssetValueWithPrecision, formatPrice } from "lib/utils";

import { PoolAssetsTable } from "./table/PoolAssetsTable";

interface PoolAssetDetailProps {
  assets: PoolLiquidity[];
}
export const PoolAssetDetail = ({ assets }: PoolAssetDetailProps) => {
  const assetInfos = useAssetInfos();

  if (!assetInfos) return <Loading />;

  const liquidity = assets.reduce((total, asset) => {
    const assetInfo = assetInfos[asset.denom];
    return total.add(
      assetInfo
        ? calAssetValueWithPrecision({
            amount: asset.amount,
            id: assetInfo.id,
            price: assetInfo.price,
            precision: assetInfo.precision,
          })
        : (big(0) as USD<Big>)
    ) as USD<Big>;
  }, big(0) as USD<Big>);

  return (
    <Box>
      <Flex py={12} justifyContent="space-between">
        <Flex gap={2} alignItems="center">
          <Heading as="h6" variant="h6">
            Pools
          </Heading>
          <Badge variant="gray" color="text.main" textColor="text.main">
            {assets.length}
          </Badge>
        </Flex>
        <Flex gap={2}>
          <Text variant="body2" color="text.dark" fontWeight="600">
            Total Liquidity:
          </Text>
          <Text variant="body2" color="text.main" fontWeight="600">
            {formatPrice(liquidity)}
          </Text>
        </Flex>
      </Flex>
      <PoolAssetsTable />
      <Flex gap="2" alignItems="center">
        <Text variant="body2" color="text.dark">
          What is asset weights and allocations?
        </Text>
        <Link
          href="https://docs.osmosis.zone/osmosis-core/modules/gamm#weights"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Flex gap="2px" alignItems="center">
            <Text color="lilac.main" variant="body2">
              Read more
            </Text>
            <CustomIcon name="external" color="lilac.main" boxSize="3" />
          </Flex>
        </Link>
      </Flex>
    </Box>
  );
};
