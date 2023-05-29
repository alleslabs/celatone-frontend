import { Flex } from "@chakra-ui/react";

import { PoolAssetCard } from "../components";
import { PoolInfoText } from "../components/PoolInfoText";
import { getPoolDenom } from "../utils";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Loading } from "lib/components/Loading";
import type { AssetInfosOpt } from "lib/services/assetService";
import { useTxData } from "lib/services/txService";
import type { PoolDetail } from "lib/types";
import { extractMsgType } from "lib/utils";
import type { MsgLockTokensDetails } from "lib/utils/tx/types";

interface MsgLockTokensDetailProps {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: MsgLockTokensDetails;
  pool: PoolDetail;
  assetInfos: AssetInfosOpt;
  isOpened: boolean;
}

export const MsgLockTokensDetail = ({
  txHash,
  blockHeight,
  msgIndex,
  msg,
  pool,
  assetInfos,
  isOpened,
}: MsgLockTokensDetailProps) => {
  const poolDenom = getPoolDenom(pool.id.toString());
  const poolAsset = msg.coins.find((coin) => coin.denom === poolDenom) ?? {
    amount: "0",
    denom: poolDenom,
  };
  const poolAssetInfo = assetInfos?.[poolDenom];

  const { data: txData, isLoading } = useTxData(txHash, isOpened);
  if (isLoading) return <Loading withBorder={false} />;

  const lockId = txData?.logs
    .find((event) => event.msg_index === msgIndex)
    ?.events?.find(
      (event) =>
        event.type.includes("lock") &&
        event.attributes.some((attr) => attr.value.includes(poolDenom))
    )
    ?.attributes.at(0)?.value;

  return (
    <Flex w="full" direction="column" gap={6}>
      <Flex gap={12}>
        <PoolInfoText
          title="Block height"
          component={
            <ExplorerLink
              value={blockHeight.toString()}
              type="block_height"
              showCopyOnHover
            />
          }
        />
        <PoolInfoText title="LockID" isText text={lockId} />
        <PoolInfoText
          title="Bonded LP"
          component={
            <MsgToken
              coin={poolAsset}
              symbol={poolAssetInfo?.symbol}
              precision={poolAssetInfo?.precision}
              fontWeight={700}
            />
          }
        />
        <PoolInfoText title="Message" isText text={extractMsgType(msg.type)} />
      </Flex>
      <PoolAssetCard
        poolId={pool.id}
        description="Bonded to"
        assetText="Bonded"
        poolAsset={poolAsset}
        poolAssetInfo={poolAssetInfo}
        isOpened={isOpened}
      />
    </Flex>
  );
};
