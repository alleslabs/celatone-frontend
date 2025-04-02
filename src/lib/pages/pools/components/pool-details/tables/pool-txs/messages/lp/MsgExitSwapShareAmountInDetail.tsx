import type { AssetInfos, Option } from "lib/types";
import type { MsgExitSwapShareAmountInDetails } from "lib/utils/tx/types";

import { Box, Flex } from "@chakra-ui/react";
import { DividerWithArrow } from "lib/components/DividerWithArrow";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { extractMsgType } from "lib/utils";

import { PoolInfoText } from "../components/PoolInfoText";
import { PoolAssetsGrid, PoolLPCard } from "./components";

interface MsgExitSwapShareAmountInDetailProps {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: MsgExitSwapShareAmountInDetails;
  assetInfos: Option<AssetInfos>;
  isOpened: boolean;
  ampCopierSection?: string;
}

export const MsgExitSwapShareAmountInDetail = ({
  txHash,
  blockHeight,
  msgIndex,
  msg,
  assetInfos,
  isOpened,
  ampCopierSection,
}: MsgExitSwapShareAmountInDetailProps) => (
  <Flex alignItems="start" direction="column" gap={6} minW="full">
    <Flex gap={12}>
      <PoolInfoText title="Block height">
        <ExplorerLink
          ampCopierSection={ampCopierSection}
          showCopyOnHover
          type="block_height"
          value={blockHeight.toString()}
        />
      </PoolInfoText>
      <PoolInfoText title="Message">{extractMsgType(msg.type)}</PoolInfoText>
    </Flex>
    <Box w="full">
      <PoolLPCard
        ampCopierSection={ampCopierSection}
        assetInfos={assetInfos}
        isJoin={false}
        isOpened={isOpened}
        msgIndex={msgIndex}
        msgShareAmount={msg.share_in_amount}
        poolId={msg.pool_id}
      />
      <DividerWithArrow />
      <PoolAssetsGrid
        ampCopierSection={ampCopierSection}
        assetInfos={assetInfos}
        isJoin={false}
        isOpened={isOpened}
        msgIndex={msgIndex}
        msgSwapDenom={msg.token_out_denom}
        txHash={txHash}
      />
    </Box>
  </Flex>
);
