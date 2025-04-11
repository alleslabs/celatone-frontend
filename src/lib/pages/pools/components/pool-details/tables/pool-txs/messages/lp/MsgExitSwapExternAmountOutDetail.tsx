import type { AssetInfos, Option } from "lib/types";
import type { MsgExitSwapExternAmountOutDetails } from "lib/utils/tx/types";

import { Box, Flex } from "@chakra-ui/react";
import { DividerWithArrow } from "lib/components/DividerWithArrow";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { extractMsgType } from "lib/utils";

import { PoolInfoText } from "../components/PoolInfoText";
import { PoolAssetsGrid, PoolLPCard } from "./components";

interface MsgExitSwapExternAmountOutDetailProps {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: MsgExitSwapExternAmountOutDetails;
  assetInfos: Option<AssetInfos>;
  isOpened: boolean;
  ampCopierSection?: string;
}

export const MsgExitSwapExternAmountOutDetail = ({
  txHash,
  blockHeight,
  msgIndex,
  msg,
  assetInfos,
  isOpened,
  ampCopierSection,
}: MsgExitSwapExternAmountOutDetailProps) => (
  <Flex alignItems="start" direction="column" gap={12} w="full">
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
        poolId={msg.pool_id}
        txHash={txHash}
      />
      <DividerWithArrow />
      <PoolAssetsGrid
        ampCopierSection={ampCopierSection}
        assetInfos={assetInfos}
        isJoin={false}
        isOpened={isOpened}
        msgAssets={[msg.token_out]}
        msgIndex={msgIndex}
        txHash={txHash}
      />
    </Box>
  </Flex>
);
