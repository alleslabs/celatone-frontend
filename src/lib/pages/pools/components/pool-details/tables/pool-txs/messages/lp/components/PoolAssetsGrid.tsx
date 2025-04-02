import type { Coin } from "@cosmjs/stargate";
import type { AssetInfos, Option } from "lib/types";

import { Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { Loading } from "lib/components/Loading";
import { useTxData } from "lib/services/tx";
import { big } from "lib/types";
import { coinsFromStr } from "lib/utils";

import { AssetCard, ErrorFetchingDetail } from "../../components";

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
  if (txHash && isLoading) return <Loading withBorder={false} />;

  const msgEvents = txData?.logs.find(
    (log) => log.msg_index === msgIndex
  )?.events;
  const receivedEvent = msgEvents?.find(
    (event) => event.type === "coin_received"
  );

  const assetAttr = receivedEvent?.attributes.find(
    (attr) => attr.key === "amount"
  )?.value;
  let eventAssets = assetAttr ? coinsFromStr(assetAttr) : undefined;
  if (msgSwapDenom) {
    const specifiedAsset = eventAssets?.find(
      (asset) => asset.denom === msgSwapDenom
    );

    const swapAttr = msgEvents
      ?.findLast((event) => event.type === "coin_received")
      ?.attributes.find((attr) => attr.key === "amount")?.value;
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
  if (!assets) return <ErrorFetchingDetail />;

  return (
    <Flex
      className="pool-msg-detail-container"
      bgColor="gray.900"
      border="1px solid"
      borderColor="transparent"
      borderRadius="8px"
      direction="column"
      gap={2}
      p={4}
    >
      <Text textColor="text.dark" variant="body2">
        {isJoin ? "Provided Assets" : "Receiving Assets"}
      </Text>
      <SimpleGrid columns={2} spacing={2}>
        {assets.map((asset) => (
          <AssetCard
            key={asset.denom}
            amount={asset.amount}
            ampCopierSection={ampCopierSection}
            assetInfo={assetInfos?.[asset.denom]}
            denom={asset.denom}
          />
        ))}
      </SimpleGrid>
    </Flex>
  );
};
