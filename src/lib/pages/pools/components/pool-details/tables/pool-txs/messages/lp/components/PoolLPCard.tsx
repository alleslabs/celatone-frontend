import { Flex } from "@chakra-ui/react";

import { ErrorFetchingDetail, PoolAssetCard } from "../../components";
import { getPoolDenom } from "../../utils";
import { Loading } from "lib/components/Loading";
import { useTxData } from "lib/services/tx";
import type { AssetInfos, Option } from "lib/types";
import { coinToTokenWithValue } from "lib/utils";

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
  txHash,
  msgIndex,
  poolId,
  msgShareAmount,
  assetInfos,
  isJoin,
  isOpened,
  ampCopierSection,
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
      direction="column"
      gap={2}
      p={4}
      border="1px solid"
      borderColor="transparent"
      borderRadius="8px"
      bgColor="gray.900"
    >
      <PoolAssetCard
        poolId={Number(poolId)}
        description={isJoin ? "Provided to" : "Removed from"}
        assetText={isJoin ? "Received" : "Burn"}
        poolToken={poolToken}
        assetInfos={assetInfos}
        isOpened={isOpened}
        ampCopierSection={ampCopierSection}
      />
    </Flex>
  );
};
