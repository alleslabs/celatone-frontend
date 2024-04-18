import { Box, Flex } from "@chakra-ui/react";

import { PoolInfoText } from "../components/PoolInfoText";
import { DividerWithArrow } from "lib/components/DividerWithArrow";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { AssetInfos, Option } from "lib/types";
import { extractMsgType } from "lib/utils";
import type { MsgJoinSwapShareAmountOutDetails } from "lib/utils/tx/types";

import { PoolAssetsGrid, PoolLPCard } from "./components";

interface MsgJoinSwapShareAmountOutDetailProps {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: MsgJoinSwapShareAmountOutDetails;
  assetInfos: Option<AssetInfos>;
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
    <Box w="full">
      <PoolAssetsGrid
        txHash={txHash}
        msgIndex={msgIndex}
        isJoin
        assetInfos={assetInfos}
        isOpened={isOpened}
        ampCopierSection={ampCopierSection}
      />
      <DividerWithArrow />
      <PoolLPCard
        msgIndex={msgIndex}
        msgShareAmount={msg.share_out_amount}
        poolId={msg.pool_id}
        assetInfos={assetInfos}
        isJoin
        isOpened={isOpened}
        ampCopierSection={ampCopierSection}
      />
    </Box>
  </Flex>
);
