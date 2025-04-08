import type { AssetInfos, Option, TokenWithValue } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import { PoolLogo } from "lib/pages/pools/components/PoolLogo";
import { usePoolsLiquidityByPoolIds } from "lib/services/pools";
import {
  coinToTokenWithValue,
  formatTokenWithValue,
  getTokenLabel,
} from "lib/utils";

interface PoolAssetCardProps {
  poolId: number;
  description: string;
  assetText: string;
  poolToken: TokenWithValue;
  assetInfos: Option<AssetInfos>;
  isOpened: boolean;
  ampCopierSection?: string;
}

export const PoolAssetCard = ({
  poolId,
  description,
  assetText,
  poolToken,
  assetInfos,
  isOpened,
  ampCopierSection,
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
        <Text textColor="text.dark" variant="body2">
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
        background="gray.800"
        borderRadius="8px"
        gap={3}
        px={3}
        py={2}
      >
        <PoolLogo
          logoSize={5}
          marginLeft={-4}
          minW="fit-content"
          textVariant="small"
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
                color="text.main"
                fontWeight={400}
                variant="body2"
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
            ampCopierSection={ampCopierSection}
            showCopyOnHover
            type="pool_id"
            value={poolId.toString()}
          />
        </div>
      </Flex>
    </>
  );
};
