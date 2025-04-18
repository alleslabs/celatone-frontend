import type { AssetInfos, Option } from "lib/types";

import { Flex } from "@chakra-ui/react";
import { Loading } from "lib/components/Loading";
import { useTxData } from "lib/services/tx";
import { coinToTokenWithValue } from "lib/utils";

import { ErrorFetchingDetail, PoolAssetCard } from "../../components";
import { getPoolDenom } from "../../utils";

interface PoolLPCardProps {
  txHash?: string;
  msgIndex: number;
  poolId: string;
  msgShareAmount?: string;
  assetInfos: Option<AssetInfos>;
  isJoin: boolean;
  isOpened: boolean;
  ampCopierSection?: string;
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
      bgColor="gray.900"
      border="1px solid"
      borderColor="transparent"
      borderRadius="8px"
      direction="column"
      gap={2}
      p={4}
    >
      <PoolAssetCard
        ampCopierSection={ampCopierSection}
        assetInfos={assetInfos}
        assetText={isJoin ? "Received" : "Burn"}
        description={isJoin ? "Provided to" : "Removed from"}
        isOpened={isOpened}
        poolId={Number(poolId)}
        poolToken={poolToken}
      />
    </Flex>
  );
};
