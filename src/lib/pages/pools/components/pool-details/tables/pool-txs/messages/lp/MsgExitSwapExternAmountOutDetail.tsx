import { Box, Flex } from "@chakra-ui/react";

import { PoolInfoText } from "../components/PoolInfoText";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { AssetInfosOpt } from "lib/services/assetService";
import { extractMsgType } from "lib/utils";
import type { MsgExitSwapExternAmountOutDetails } from "lib/utils/tx/types";

import { PoolLPCard, LiquidityDivider, PoolAssetsGrid } from "./components";

interface MsgExitSwapExternAmountOutDetailProps {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: MsgExitSwapExternAmountOutDetails;
  assetInfos: AssetInfosOpt;
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
  <Flex w="full" direction="column" alignItems="start" gap={12}>
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
      <PoolLPCard
        txHash={txHash}
        msgIndex={msgIndex}
        poolId={msg.pool_id}
        assetInfos={assetInfos}
        isJoin={false}
        isOpened={isOpened}
        ampCopierSection={ampCopierSection}
      />
      <LiquidityDivider />
      <PoolAssetsGrid
        txHash={txHash}
        msgIndex={msgIndex}
        msgAssets={[msg.token_out]}
        isJoin={false}
        assetInfos={assetInfos}
        isOpened={isOpened}
        ampCopierSection={ampCopierSection}
      />
    </Box>
  </Flex>
);
