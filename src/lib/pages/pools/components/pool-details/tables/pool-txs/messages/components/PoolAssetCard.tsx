import { Flex, Text } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import { PoolLogo } from "lib/pages/pools/components/PoolLogo";
import { usePoolAssetsbyPoolIds } from "lib/services/poolService";
import type { AssetInfo, Option, TokenWithValue } from "lib/types";
import {
  coinToTokenWithValue,
  formatBalanceWithDenom,
  getTokenLabel,
} from "lib/utils";

interface PoolAssetCardProps {
  poolId: number;
  description: string;
  assetText: string;
  poolAsset: Coin;
  poolAssetInfo: Option<AssetInfo>;
  isOpened: boolean;
}

export const PoolAssetCard = ({
  poolId,
  description,
  assetText,
  poolAsset,
  poolAssetInfo,
  isOpened,
}: PoolAssetCardProps) => {
  const { data: poolAssets, isLoading } = usePoolAssetsbyPoolIds(
    [poolId],
    isOpened
  );

  if (isLoading) return <Loading />;
  if (!poolAssets)
    return (
      <EmptyState message="There is an error during fetching transaction detail." />
    );

  const tokens = poolAssets[poolId].map<TokenWithValue>((denom) =>
    coinToTokenWithValue(denom, "0", poolAssetInfo)
  );
  return (
    <>
      <Flex justifyContent="space-between">
        <Text variant="body2" textColor="text.dark">
          {description}
        </Text>
        <Text>
          {assetText}
          <span style={{ fontWeight: 700 }}>
            {formatBalanceWithDenom({
              coin: poolAsset,
              symbol: poolAssetInfo?.symbol,
              precision: poolAssetInfo?.precision,
            })}
          </span>
        </Text>
      </Flex>
      <Flex
        alignItems="center"
        gap={3}
        px={3}
        py={2}
        borderRadius="8px"
        background="pebble.800"
      >
        <PoolLogo
          tokens={tokens}
          logoSize={5}
          marginLeft={-4}
          minW="fit-content"
          textVariant="small"
        />
        <div>
          <Flex
            gap={1}
            css={{
              "p:last-of-type > span": {
                display: "none",
              },
            }}
          >
            {tokens.map((token) => (
              <Text
                key={token.denom}
                variant="body2"
                fontWeight={400}
                color="text.main"
              >
                {token.symbol ?? getTokenLabel(token.denom)}
                <Text as="span" fontWeight={400} color="honeydew.main">
                  {" "}
                  /
                </Text>
              </Text>
            ))}
          </Flex>
          <ExplorerLink
            type="pool_id"
            value={poolId.toString()}
            showCopyOnHover
          />
        </div>
      </Flex>
    </>
  );
};
