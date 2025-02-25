import { Box, Flex } from "@chakra-ui/react";

import { DividerWithArrow } from "lib/components/DividerWithArrow";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { AssetInfos, Option } from "lib/types";
import { extractMsgType } from "lib/utils";
import type { MsgJoinSwapExternAmountInDetails } from "lib/utils/tx/types";

import { PoolAssetsGrid, PoolLPCard } from "./components";
import { PoolInfoText } from "../components/PoolInfoText";

interface MsgJoinSwapExternAmountInDetailProps {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: MsgJoinSwapExternAmountInDetails;
  assetInfos: Option<AssetInfos>;
  isOpened: boolean;
  ampCopierSection?: string;
}

export const MsgJoinSwapExternAmountInDetail = ({
  txHash,
  blockHeight,
  msgIndex,
  msg,
  assetInfos,
  isOpened,
  ampCopierSection,
}: MsgJoinSwapExternAmountInDetailProps) => (
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
        msgIndex={msgIndex}
        msgAssets={[msg.token_in]}
        isJoin
        assetInfos={assetInfos}
        isOpened={isOpened}
        ampCopierSection={ampCopierSection}
      />
      <DividerWithArrow />
      <PoolLPCard
        txHash={txHash}
        msgIndex={msgIndex}
        poolId={msg.pool_id}
        assetInfos={assetInfos}
        isJoin
        isOpened={isOpened}
        ampCopierSection={ampCopierSection}
      />
    </Box>
  </Flex>
);
