import { Box, Flex } from "@chakra-ui/react";

import { ErrorFetchingDetail, PoolAssetCard } from "../components";
import { PoolInfoText } from "../components/PoolInfoText";
import { getPoolDenom } from "../utils";
import { MsgToken } from "lib/components/action-msg/MsgToken";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Loading } from "lib/components/Loading";
import { useTxData } from "lib/services/tx";
import type { AssetInfos, Option, PoolData } from "lib/types";
import { coinToTokenWithValue, extractMsgType } from "lib/utils";
import type { MsgLockTokensDetails } from "lib/utils/tx/types";

interface MsgLockTokensDetailProps {
  ampCopierSection?: string;
  assetInfos: Option<AssetInfos>;
  blockHeight: number;
  isOpened: boolean;
  msg: MsgLockTokensDetails;
  msgIndex: number;
  pool: PoolData;
  txHash: string;
}

export const MsgLockTokensDetail = ({
  ampCopierSection,
  assetInfos,
  blockHeight,
  isOpened,
  msg,
  msgIndex,
  pool,
  txHash,
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
    <Flex gap={6} w="full" direction="column">
      <Flex gap={12}>
        <PoolInfoText title="Block height">
          <ExplorerLink
            type="block_height"
            value={blockHeight.toString()}
            ampCopierSection={ampCopierSection}
            showCopyOnHover
          />
        </PoolInfoText>
        <PoolInfoText title="LockID">{lockId}</PoolInfoText>
        <PoolInfoText title="Bonded LP">
          <MsgToken
            ampCopierSection={ampCopierSection}
            fontWeight={700}
            token={poolToken}
          />
        </PoolInfoText>

        <PoolInfoText title="Message">{extractMsgType(msg.type)}</PoolInfoText>
      </Flex>
      <Box w="full">
        <PoolAssetCard
          assetText="Bonded"
          isOpened={isOpened}
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          description="Bonded to"
          poolId={pool.id}
          poolToken={poolToken}
        />
      </Box>
    </Flex>
  );
};
