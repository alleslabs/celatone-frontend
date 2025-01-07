import { Box, Flex } from "@chakra-ui/react";

import { PoolInfoText } from "../components/PoolInfoText";
import { DividerWithArrow } from "lib/components/DividerWithArrow";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { AssetInfos, Option } from "lib/types";
import { extractMsgType } from "lib/utils";
import type { MsgJoinSwapExternAmountInDetails } from "lib/utils/tx/types";

import { PoolAssetsGrid, PoolLPCard } from "./components";

interface MsgJoinSwapExternAmountInDetailProps {
  ampCopierSection?: string;
  assetInfos: Option<AssetInfos>;
  blockHeight: number;
  isOpened: boolean;
  msg: MsgJoinSwapExternAmountInDetails;
  msgIndex: number;
  txHash: string;
}

export const MsgJoinSwapExternAmountInDetail = ({
  ampCopierSection,
  assetInfos,
  blockHeight,
  isOpened,
  msg,
  msgIndex,
  txHash,
}: MsgJoinSwapExternAmountInDetailProps) => (
  <Flex alignItems="start" gap={6} w="full" direction="column">
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
      <PoolAssetsGrid
        isOpened={isOpened}
        msgAssets={[msg.token_in]}
        msgIndex={msgIndex}
        ampCopierSection={ampCopierSection}
        assetInfos={assetInfos}
        isJoin
      />
      <DividerWithArrow />
      <PoolLPCard
        isOpened={isOpened}
        msgIndex={msgIndex}
        txHash={txHash}
        ampCopierSection={ampCopierSection}
        assetInfos={assetInfos}
        isJoin
        poolId={msg.pool_id}
      />
    </Box>
  </Flex>
);
