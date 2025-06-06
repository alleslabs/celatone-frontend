import type { AssetInfos, Option } from "lib/types";
import type { MsgExitPoolDetails } from "lib/utils/tx/types";

import { Box, Flex } from "@chakra-ui/react";
import { DividerWithArrow } from "lib/components/DividerWithArrow";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { extractMsgType } from "lib/utils";

import { PoolInfoText } from "../components/PoolInfoText";
import { PoolAssetsGrid, PoolLPCard } from "./components";

interface MsgExitPoolDetailProps {
  ampCopierSection?: string;
  assetInfos: Option<AssetInfos>;
  blockHeight: number;
  isOpened: boolean;
  msg: MsgExitPoolDetails;
  msgIndex: number;
  txHash: string;
}

export const MsgExitPoolDetail = ({
  ampCopierSection,
  assetInfos,
  blockHeight,
  isOpened,
  msg,
  msgIndex,
  txHash,
}: MsgExitPoolDetailProps) => (
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
        txHash={txHash}
      />
    </Box>
  </Flex>
);
