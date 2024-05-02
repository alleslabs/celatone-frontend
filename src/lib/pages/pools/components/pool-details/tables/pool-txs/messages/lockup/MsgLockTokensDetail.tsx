import { Box, Flex } from "@chakra-ui/react";

import { ErrorFetchingDetail, PoolAssetCard } from "../components";
import { PoolInfoText } from "../components/PoolInfoText";
import { getPoolDenom } from "../utils";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Loading } from "lib/components/Loading";
import { useTxData } from "lib/services/wasm/txs";
import type { AssetInfos, Option, PoolDetail } from "lib/types";
import { coinToTokenWithValue, extractMsgType } from "lib/utils";
import type { MsgLockTokensDetails } from "lib/utils/tx/types";

interface MsgLockTokensDetailProps {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: MsgLockTokensDetails;
  pool: PoolDetail;
  assetInfos: Option<AssetInfos>;
  isOpened: boolean;
  ampCopierSection?: string;
}

export const MsgLockTokensDetail = ({
  txHash,
  blockHeight,
  msgIndex,
  msg,
  pool,
  assetInfos,
  isOpened,
  ampCopierSection,
}: MsgLockTokensDetailProps) => {
  const { data: txData, isLoading } = useTxData(txHash, isOpened);
  if (isLoading) return <Loading withBorder={false} />;
  if (!txData) return <ErrorFetchingDetail />;

  const poolDenom = getPoolDenom(pool.id.toString());
  const poolAsset = msg.coins.find((coin) => coin.denom === poolDenom) ?? {
    amount: "0",
    denom: poolDenom,
  };
  const poolToken = coinToTokenWithValue(
    poolAsset.denom,
    poolAsset.amount,
    assetInfos
  );

  const msgEvents = txData.logs.find(
    (log) => log.msg_index === msgIndex
  )?.events;
  const lockId = msgEvents
    ?.find((event) => event.type === "add_tokens_to_lock")
    ?.attributes.find((attr) => attr.key === "period_lock_id")?.value;

  return (
    <Flex w="full" direction="column" gap={6}>
      <Flex gap={12}>
        <PoolInfoText title="Block height">
          <ExplorerLink
            value={blockHeight.toString()}
            type="block_height"
            showCopyOnHover
            ampCopierSection={ampCopierSection}
          />
        </PoolInfoText>
        <PoolInfoText title="LockID">{lockId}</PoolInfoText>
        <PoolInfoText title="Bonded LP">
          <MsgToken
            token={poolToken}
            fontWeight={700}
            ampCopierSection={ampCopierSection}
          />
        </PoolInfoText>

        <PoolInfoText title="Message">{extractMsgType(msg.type)}</PoolInfoText>
      </Flex>
      <Box w="full">
        <PoolAssetCard
          poolId={pool.id}
          description="Bonded to"
          assetText="Bonded"
          poolToken={poolToken}
          assetInfos={assetInfos}
          isOpened={isOpened}
          ampCopierSection={ampCopierSection}
        />
      </Box>
    </Flex>
  );
};
