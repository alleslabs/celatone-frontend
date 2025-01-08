import { Box, Flex } from "@chakra-ui/react";

import { PoolInfoText } from "../components/PoolInfoText";
import { DividerWithArrow } from "lib/components/DividerWithArrow";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { AssetInfos, Option } from "lib/types";
import { extractMsgType } from "lib/utils";
import type { MsgExitSwapExternAmountOutDetails } from "lib/utils/tx/types";

import { PoolAssetsGrid, PoolLPCard } from "./components";

interface MsgExitSwapExternAmountOutDetailProps {
  ampCopierSection?: string;
  assetInfos: Option<AssetInfos>;
  blockHeight: number;
  isOpened: boolean;
  msg: MsgExitSwapExternAmountOutDetails;
  msgIndex: number;
  txHash: string;
}

export const MsgExitSwapExternAmountOutDetail = ({
  ampCopierSection,
  assetInfos,
  blockHeight,
  isOpened,
  msg,
  msgIndex,
  txHash,
}: MsgExitSwapExternAmountOutDetailProps) => (
  <Flex alignItems="start" gap={12} w="full" direction="column">
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
        txHash={txHash}
        ampCopierSection={ampCopierSection}
        assetInfos={assetInfos}
        isJoin={false}
        poolId={msg.pool_id}
      />
      <DividerWithArrow />
      <PoolAssetsGrid
        isOpened={isOpened}
        msgAssets={[msg.token_out]}
        msgIndex={msgIndex}
        txHash={txHash}
        ampCopierSection={ampCopierSection}
        assetInfos={assetInfos}
        isJoin={false}
      />
    </Box>
  </Flex>
);
