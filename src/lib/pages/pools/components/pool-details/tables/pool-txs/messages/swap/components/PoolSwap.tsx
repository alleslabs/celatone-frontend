import { Flex, Text } from "@chakra-ui/react";

import { AssetCard } from "../../AssetCard";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import type { AssetInfosOpt } from "lib/services/assetService";
import { useTxData } from "lib/services/txService";

interface PoolSwapInterface {
  txHash: string;
  msgIndex: number;
  assetInfos: AssetInfosOpt;
  isOpened: boolean;
}

export const PoolSwap = ({
  txHash,
  msgIndex,
  assetInfos,
  isOpened,
}: PoolSwapInterface) => {
  const { data: txData, isLoading } = useTxData(txHash, isOpened);
  if (isLoading) return <Loading withBorder={false} />;

  const swapEvent = txData?.logs
    .find((event) => event.msg_index === msgIndex)
    ?.events?.find((event) => event.type === "token_swapped");
  if (!swapEvent)
    return (
      <EmptyState message="There is an error during fetching message detail." />
    );

  // Get the token-in from the third attribute of the event e.g. 10000utoken
  const inAsset = swapEvent.attributes.at(3)?.value ?? "";
  const inAmount = inAsset.match(/[0-9]+/g)?.[0] ?? "";
  const inDenom = inAsset.slice(inAmount.length);

  // Get the token-out from the last attribute of the event e.g. 10000utoken
  const outAsset = swapEvent.attributes.at(-1)?.value ?? "";
  const outAmount = outAsset.match(/[0-9]+/g)?.[0] ?? "";
  const outDenom = outAsset.slice(outAmount.length);

  return (
    <Flex gap={4} alignItems="center">
      <div>
        <Text variant="body2" textColor="pebble.500" fontWeight={500}>
          From
        </Text>
        <AssetCard
          amount={inAmount}
          denom={inDenom}
          assetInfo={assetInfos?.[inDenom]}
        />
      </div>
      <CustomIcon name="arrow-right" boxSize={6} color="honeydew.main" />
      <div>
        <Text variant="body2" textColor="pebble.500" fontWeight={500}>
          To
        </Text>
        <AssetCard
          amount={outAmount}
          denom={outDenom}
          assetInfo={assetInfos?.[outDenom]}
        />
      </div>
    </Flex>
  );
};
