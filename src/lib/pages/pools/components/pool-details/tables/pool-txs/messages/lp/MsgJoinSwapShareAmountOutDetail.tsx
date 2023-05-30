import { Flex } from "@chakra-ui/react";

import { PoolInfoText } from "../components/PoolInfoText";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { AssetInfosOpt } from "lib/services/assetService";
import { extractMsgType } from "lib/utils";
import type { MsgJoinSwapShareAmountOutDetails } from "lib/utils/tx/types";

import { LiquidityDivider, PoolLPCard, PoolAssetsGrid } from "./components";

interface MsgJoinSwapShareAmountOutDetailProps {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: MsgJoinSwapShareAmountOutDetails;
  assetInfos: AssetInfosOpt;
  isOpened: boolean;
  ampCopierSection?: string;
}

export const MsgJoinSwapShareAmountOutDetail = ({
  txHash,
  blockHeight,
  msgIndex,
  msg,
  assetInfos,
  isOpened,
  ampCopierSection,
}: MsgJoinSwapShareAmountOutDetailProps) => (
  <Flex w="full" direction="column" alignItems="start" gap={6}>
    <Flex gap={12}>
      <PoolInfoText title="Block height">
        <ExplorerLink
          value={blockHeight.toString()}
          type="block_height"
          showCopyOnHover
          ampCopierSection={ampCopierSection}
        />
      </PoolInfoText>
      <PoolInfoText title="Message">{extractMsgType(msg.type)}</PoolInfoText>
    </Flex>
    <PoolAssetsGrid
      txHash={txHash}
      msgIndex={msgIndex}
      isJoin
      assetInfos={assetInfos}
      isOpened={isOpened}
      ampCopierSection={ampCopierSection}
    />
    <LiquidityDivider />
    <PoolLPCard
      msgIndex={msgIndex}
      msgShareAmount={msg.share_amount_out}
      poolId={msg.pool_id}
      assetInfos={assetInfos}
      isJoin
      isOpened={isOpened}
      ampCopierSection={ampCopierSection}
    />
  </Flex>
);
