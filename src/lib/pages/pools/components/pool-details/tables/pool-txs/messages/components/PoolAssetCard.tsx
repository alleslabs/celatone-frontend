import { Flex, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import { PoolLogo } from "lib/pages/pools/components/PoolLogo";
import { usePoolsLiquidityByPoolIds } from "lib/services/pools";
import type { AssetInfos, Option, TokenWithValue } from "lib/types";
import {
  coinToTokenWithValue,
  formatTokenWithValue,
  getTokenLabel,
} from "lib/utils";

interface PoolAssetCardProps {
  ampCopierSection?: string;
  assetInfos: Option<AssetInfos>;
  assetText: string;
  description: string;
  isOpened: boolean;
  poolId: number;
  poolToken: TokenWithValue;
}

export const PoolAssetCard = ({
  ampCopierSection,
  assetInfos,
  assetText,
  description,
  isOpened,
  poolId,
  poolToken,
}: PoolAssetCardProps) => {
  const { data: poolAssets, isLoading } = usePoolsLiquidityByPoolIds(
    [poolId],
    isOpened
  );

  if (isLoading) return <Loading />;
  if (!poolAssets)
    return (
      <EmptyState message="There is an error during fetching transaction detail." />
    );

  const tokens = poolAssets[poolId].map<TokenWithValue>((denom) =>
    coinToTokenWithValue(denom, "0", assetInfos)
  );
  return (
    <>
      <Flex justifyContent="space-between">
        <Text variant="body2" textColor="text.dark">
          {description}
        </Text>
        <Text>
          {assetText}{" "}
          <span style={{ fontWeight: 700 }}>
            {formatTokenWithValue(poolToken)}
          </span>
        </Text>
      </Flex>
      <Flex
        alignItems="center"
        gap={3}
        px={3}
        py={2}
        background="gray.800"
        borderRadius="8px"
      >
        <PoolLogo
          marginLeft={-4}
          minW="fit-content"
          textVariant="small"
          logoSize={5}
          tokens={tokens}
        />
        <div>
          <Flex
            css={{
              "p:last-of-type > span": {
                display: "none",
              },
            }}
            gap={1}
          >
            {tokens.map((token) => (
              <Text
                key={token.denom}
                variant="body2"
                color="text.main"
                fontWeight={400}
              >
                {getTokenLabel(token.denom, token.symbol)}
                <Text as="span" color="primary.main" fontWeight={400}>
                  {" "}
                  /
                </Text>
              </Text>
            ))}
          </Flex>
          <ExplorerLink
            type="pool_id"
            value={poolId.toString()}
            ampCopierSection={ampCopierSection}
            showCopyOnHover
          />
        </div>
      </Flex>
    </>
  );
};
