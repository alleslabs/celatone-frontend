import { Box, Flex } from "@chakra-ui/react";

import { PoolInfoText } from "../components/PoolInfoText";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { AssetInfos, Option } from "lib/types";
import { extractMsgType } from "lib/utils";
import type { MsgSwapExactAmountInDetails } from "lib/utils/tx/types";

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
      <PoolSwap
        exactInput={{
          amount: msg.token_in,
          expectedDenom: msg.routes[msg.routes.length - 1].tokenOutDenom,
          isExactIn: true,
        }}
        isOpened={isOpened}
        msgIndex={msgIndex}
        txHash={txHash}
        ampCopierSection={ampCopierSection}
        assetInfos={assetInfos}
      />
      <PoolRoute
        isOpened={isOpened}
        ampCopierSection={ampCopierSection}
        assetInfos={assetInfos}
        routes={msg.routes}
      />
    </Box>
  </Flex>
);
