import { Flex, SimpleGrid, Text } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";
import big from "big.js";

import { AssetCard } from "../../components";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import { useTxData } from "lib/services/txService";
import type { AssetInfos, Option } from "lib/types";
import { coinsFromStr } from "lib/utils";

interface PoolAssetsGridProps {
  txHash?: string;
  msgIndex: number;
  msgAssets?: Coin[];
  msgSwapDenom?: string;
  isJoin: boolean;
  assetInfos: Option<AssetInfos>;
  isOpened: boolean;
  ampCopierSection?: string;
}

export const PoolAssetsGrid = ({
  txHash,
  msgIndex,
  msgAssets,
  msgSwapDenom,
  isJoin,
  assetInfos,
  isOpened,
  ampCopierSection,
}: PoolAssetsGridProps) => {
  const { data: txData, isLoading } = useTxData(txHash, isOpened);
  if (!msgAssets && isLoading) return <Loading withBorder={false} />;

  const receivedEvent = txData?.logs
    .find((log) => log.msg_index === msgIndex)
    ?.events?.find((event) => event.type === "coin_received");

  const assetAttr = receivedEvent?.attributes[1]?.value;
  let eventAssets = assetAttr ? coinsFromStr(assetAttr) : undefined;
  if (msgSwapDenom) {
    const specifiedAsset = eventAssets?.find(
      (asset) => asset.denom === msgSwapDenom
    );

    const swapAttr =
      receivedEvent?.attributes[receivedEvent.attributes.length - 1]?.value;
    const swapAsset = swapAttr ? coinsFromStr(swapAttr)[0] : undefined;

    eventAssets =
      specifiedAsset && swapAsset
        ? [
            {
              amount: big(specifiedAsset.amount)
                .add(big(swapAsset.amount))
                .toString(),
              denom: msgSwapDenom,
            },
          ]
        : [];
  }

  const assets = msgAssets ?? eventAssets;
  if (!assets)
    return (
      <EmptyState message="There is an error during fetching message detail." />
    );

  return (
    <Flex
      className="pool-msg-detail-container"
      direction="column"
      gap={2}
      p={4}
      border="1px solid"
      borderColor="transparent"
      borderRadius="8px"
      bgColor="gray.900"
    >
      <Text variant="body2" textColor="text.dark">
        {isJoin ? "Provided Assets" : "Receiving Assets"}
      </Text>
      <SimpleGrid columns={2} spacing={2}>
        {assets.map((asset) => (
          <AssetCard
            key={asset.denom}
            amount={asset.amount}
            denom={asset.denom}
            assetInfo={assetInfos?.[asset.denom]}
            ampCopierSection={ampCopierSection}
          />
        ))}
      </SimpleGrid>
    </Flex>
  );
};
