import { Box, Flex, Text } from "@chakra-ui/react";

import { AssetCard } from "../AssetCard";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import type { AssetInfosOpt } from "lib/services/assetService";
import { useTxData } from "lib/services/txService";

interface PoolSwapInterface {
  txHash: string;
  msgIndex: number;
  assetInfos: AssetInfosOpt;
}

export const PoolSwap = ({
  txHash,
  msgIndex,
  assetInfos,
}: PoolSwapInterface) => {
  const { data: txData, isLoading } = useTxData(txHash);
  if (isLoading) return <Loading withBorder={false} />;

  const swapEvent = txData?.logs
    .find((event) => event.msg_index === msgIndex)
    ?.events?.find((event) => event.type === "token_swapped");
  if (!swapEvent)
    return (
      <EmptyState message="There is an error during fetching message detail." />
    );

  const inAmount = swapEvent.attributes[3].value.match(/\d+/g)?.[0] ?? "";
  const inDenom = swapEvent.attributes[3].value.slice(inAmount.length);

  const outAmount = swapEvent.attributes[-1].value.match(/\d+/g)?.[0] ?? "";
  const outDenom = swapEvent.attributes[-1].value.slice(inAmount.length);

  return (
    <Flex gap={4}>
      <Box>
        <Text variant="body2" textColor="pebble.500" fontWeight={500}>
          From
        </Text>
        <AssetCard
          amount={inAmount}
          denom={inDenom}
          assetInfo={assetInfos?.[inDenom]}
        />
      </Box>
      <CustomIcon name="arrow-right" boxSize={6} />
      <Box>
        <Text variant="body2" textColor="pebble.500" fontWeight={500}>
          To
        </Text>
        <AssetCard
          amount={outAmount}
          denom={outDenom}
          assetInfo={assetInfos?.[outAmount]}
        />
      </Box>
    </Flex>
  );
};
