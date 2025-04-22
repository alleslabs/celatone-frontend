import type { AssetInfos, Option } from "lib/types";
import type { MsgJoinSwapExternAmountInDetails } from "lib/utils/tx/types";

import { Box, Flex } from "@chakra-ui/react";
import { DividerWithArrow } from "lib/components/DividerWithArrow";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { extractMsgType } from "lib/utils";

import { PoolInfoText } from "../components/PoolInfoText";
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
  <Flex alignItems="start" direction="column" gap={6} w="full">
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
      <PoolAssetsGrid
        ampCopierSection={ampCopierSection}
        assetInfos={assetInfos}
        isJoin
        isOpened={isOpened}
        msgAssets={[msg.token_in]}
        msgIndex={msgIndex}
      />
      <DividerWithArrow />
      <PoolLPCard
        ampCopierSection={ampCopierSection}
        assetInfos={assetInfos}
        isJoin
        isOpened={isOpened}
        msgIndex={msgIndex}
        poolId={msg.pool_id}
        txHash={txHash}
      />
    </Box>
  </Flex>
);
