import type { AssetInfos, Option } from "lib/types";
import type { MsgSwapExactAmountInDetails } from "lib/utils/tx/types";

import { Box, Flex } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { extractMsgType } from "lib/utils";

import { PoolInfoText } from "../components/PoolInfoText";
import { PoolRoute, PoolSwap } from "./components";

interface MsgSwapExactAmountInDetailProps {
  ampCopierSection?: string;
  assetInfos: Option<AssetInfos>;
  blockHeight: number;
  isOpened: boolean;
  msg: MsgSwapExactAmountInDetails;
  msgIndex: number;
  txHash: string;
}

export const MsgSwapExactAmountInDetail = ({
  ampCopierSection,
  assetInfos,
  blockHeight,
  isOpened,
  msg,
  msgIndex,
  txHash,
}: MsgSwapExactAmountInDetailProps) => (
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
      <PoolSwap
        ampCopierSection={ampCopierSection}
        assetInfos={assetInfos}
        exactInput={{
          amount: msg.token_in,
          expectedDenom: msg.routes[msg.routes.length - 1].tokenOutDenom,
          isExactIn: true,
        }}
        isOpened={isOpened}
        msgIndex={msgIndex}
        txHash={txHash}
      />
      <PoolRoute
        ampCopierSection={ampCopierSection}
        assetInfos={assetInfos}
        isOpened={isOpened}
        routes={msg.routes}
      />
    </Box>
  </Flex>
);
