import { Flex } from "@chakra-ui/react";

import { ErrorFetchingDetail, PoolAssetCard } from "../../components";
import { getPoolDenom } from "../../utils";
import { Loading } from "lib/components/Loading";
import { useTxData } from "lib/services/tx";
import type { AssetInfos, Option } from "lib/types";
import { coinToTokenWithValue } from "lib/utils";

interface PoolLPCardProps {
  ampCopierSection?: string;
  assetInfos: Option<AssetInfos>;
  isJoin: boolean;
  isOpened: boolean;
  msgIndex: number;
  msgShareAmount?: string;
  poolId: string;
  txHash?: string;
}

export const PoolLPCard = ({
  ampCopierSection,
  assetInfos,
  isJoin,
  isOpened,
  msgIndex,
  msgShareAmount,
  poolId,
  txHash,
}: PoolLPCardProps) => {
  const { data: txData, isLoading } = useTxData(txHash, isOpened);
  if (txHash && isLoading) return <Loading withBorder={false} />;

  const poolDenom = getPoolDenom(poolId);

  const msgEvents = txData?.logs.find(
    (log) => log.msg_index === msgIndex
  )?.events;
  const eventShareAmount = msgEvents
    ?.find(
      (event) =>
        event.type === "coin_received" &&
        event.attributes.some((attr) => attr.value.includes(poolDenom))
    )
    ?.attributes.find((attr) => attr.key === "amount")
    ?.value.slice(0, -poolDenom.length);

  const shareAmount = msgShareAmount ?? eventShareAmount;
  if (!shareAmount) return <ErrorFetchingDetail />;

  const poolToken = coinToTokenWithValue(poolDenom, shareAmount, assetInfos);
  return (
    <Flex
      className="pool-msg-detail-container"
      gap={2}
      p={4}
      bgColor="gray.900"
      border="1px solid"
      borderColor="transparent"
      borderRadius="8px"
      direction="column"
    >
      <PoolAssetCard
        assetText={isJoin ? "Received" : "Burn"}
        isOpened={isOpened}
        ampCopierSection={ampCopierSection}
        assetInfos={assetInfos}
        description={isJoin ? "Provided to" : "Removed from"}
        poolId={Number(poolId)}
        poolToken={poolToken}
      />
    </Flex>
  );
};
