import { Box, Flex } from "@chakra-ui/react";

import { PoolInfoText } from "../components/PoolInfoText";
import { DividerWithArrow } from "lib/components/DividerWithArrow";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { AssetInfos, Option } from "lib/types";
import { extractMsgType } from "lib/utils";
import type { MsgExitSwapShareAmountInDetails } from "lib/utils/tx/types";

import { PoolAssetsGrid, PoolLPCard } from "./components";

interface MsgExitSwapShareAmountInDetailProps {
  ampCopierSection?: string;
  assetInfos: Option<AssetInfos>;
  blockHeight: number;
  isOpened: boolean;
  msg: MsgExitSwapShareAmountInDetails;
  msgIndex: number;
  txHash: string;
}

export const MsgExitSwapShareAmountInDetail = ({
  ampCopierSection,
  assetInfos,
  blockHeight,
  isOpened,
  msg,
  msgIndex,
  txHash,
}: MsgExitSwapShareAmountInDetailProps) => (
  <Flex alignItems="start" gap={6} minW="full" direction="column">
    <Flex gap={12}>
      <PoolInfoText title="Block height">
        <ExplorerLink
          type="block_height"
          value={blockHeight.toString()}
          ampCopierSection={ampCopierSection}
          showCopyOnHover
        />
      </PoolInfoText>
      <PoolInfoText title="Message">{extractMsgType(msg.type)}</PoolInfoText>
    </Flex>
    <Box w="full">
      <PoolLPCard
        isOpened={isOpened}
        msgIndex={msgIndex}
        ampCopierSection={ampCopierSection}
        assetInfos={assetInfos}
        isJoin={false}
        msgShareAmount={msg.share_in_amount}
        poolId={msg.pool_id}
      />
      <DividerWithArrow />
      <PoolAssetsGrid
        isOpened={isOpened}
        msgIndex={msgIndex}
        txHash={txHash}
        ampCopierSection={ampCopierSection}
        assetInfos={assetInfos}
        isJoin={false}
        msgSwapDenom={msg.token_out_denom}
      />
    </Box>
  </Flex>
);
