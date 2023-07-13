import { Flex } from "@chakra-ui/react";

import { PoolAssetCard } from "../../components";
import { getPoolDenom } from "../../utils";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import type { AssetInfosOpt } from "lib/services/assetService";
import { useTxData } from "lib/services/txService";

interface PoolLPCardProps {
  txHash?: string;
  msgIndex: number;
  poolId: string;
  msgShareAmount?: string;
  assetInfos: AssetInfosOpt;
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
  if (!msgShareAmount && isLoading) return <Loading withBorder={false} />;

  const poolDenom = getPoolDenom(poolId);
  const eventShareAmount = txData?.logs
    .find((log) => log.msg_index === msgIndex)
    ?.events?.find((event) => event.type === "coin_received")
    ?.attributes.at(3)
    ?.value.slice(0, -poolDenom.length);

  const shareAmount = msgShareAmount ?? eventShareAmount;
  if (!shareAmount)
    return (
      <EmptyState message="There is an error during fetching transaction detail." />
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
      <PoolAssetCard
        poolId={Number(poolId)}
        description={isJoin ? "Provided to" : "Removed from"}
        assetText={isJoin ? "Received" : "Burn"}
        poolAsset={{ amount: shareAmount, denom: poolDenom }}
        poolAssetInfo={assetInfos?.[poolDenom]}
        assetInfos={assetInfos}
        isOpened={isOpened}
        ampCopierSection={ampCopierSection}
      />
    </Flex>
  );
};
