import type { DecodedMessage } from "@initia/tx-decoder";

import { Flex, Text } from "@chakra-ui/react";
import { Coin } from "@initia/initia.js";
import { useGetAddressType } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TokenImageRender } from "lib/components/token";
import { useAssetInfos } from "lib/services/assetService";
import {
  coinToTokenWithValue,
  formatTokenWithValue,
  getTokenLabel,
} from "lib/utils";
import { useState } from "react";

import type { TxMsgData } from "../tx-message";

import { CoinsComponent } from "../tx-message/msg-receipts/CoinsComponent";
import { DecodeMessageBody } from "./decode-message-body";
import { DecodeMessageExecute } from "./decode-message-execute";
import { DecodeMessageHeader } from "./decode-message-header";
import { DecodeMessageRow } from "./decode-message-row";

interface DecodeMessageSwapProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "swap";
  };
}

export const DecodeMessageSwap = ({
  compact,
  decodedMessage,
  log,
  msgBody,
  msgCount,
}: DecodeMessageSwapProps) => {
  const isSingleMsg = msgCount === 1;
  const [expand, setExpand] = useState(!!isSingleMsg);
  const getAddressType = useGetAddressType();
  const { data, isIbc, isOp } = decodedMessage;
  const { data: assetInfos } = useAssetInfos({ withPrices: false });

  const tokenIn = coinToTokenWithValue(data.denomIn, data.amountIn, assetInfos);
  const tokenInWithValue = formatTokenWithValue(tokenIn);
  const coinIn = new Coin(data.denomIn, data.amountIn);

  const tokenOut = coinToTokenWithValue(
    data.denomOut,
    data.amountOut,
    assetInfos
  );
  const tokenOutWithValue = formatTokenWithValue(tokenOut);
  const coinOut = new Coin(data.denomOut, data.amountOut);

  return (
    <Flex direction="column">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
        iconName="swap"
        isExpand={expand}
        isIbc={isIbc}
        isOpinit={isOp}
        isSingleMsg={!!isSingleMsg}
        label="Swap"
        msgCount={msgCount}
        type={msgBody["@type"]}
        onClick={() => setExpand(!expand)}
      >
        <Flex align="center" gap={1} minWidth="fit-content">
          <TokenImageRender
            alt={getTokenLabel(data.denomIn, data.amountIn)}
            boxSize={4}
            logo={tokenIn.logo}
          />
          <Text whiteSpace="nowrap">{tokenInWithValue}</Text>
        </Flex>
        <Flex align="center" gap={2} minWidth="fit-content">
          <Text color="text.dark">for</Text>
          <Flex align="center" gap={1} minWidth="fit-content">
            <TokenImageRender
              alt={getTokenLabel(data.denomOut, data.amountOut)}
              boxSize={4}
              logo={tokenOut.logo}
            />
            <Text whiteSpace="nowrap">{tokenOutWithValue}</Text>
          </Flex>
        </Flex>
        {!compact && (
          <Flex align="center" gap={2}>
            <Text color="text.dark">by</Text>
            <ExplorerLink
              showCopyOnHover
              textVariant="body1"
              type={getAddressType(data.from)}
              value={data.from}
            />
          </Flex>
        )}
      </DecodeMessageHeader>
      <DecodeMessageBody compact={compact} isExpand={expand} log={log}>
        <DecodeMessageRow title="Sender">
          <ExplorerLink
            maxWidth="full"
            showCopyOnHover
            textFormat="normal"
            type={getAddressType(data.from)}
            value={data.from}
            wordBreak="break-word"
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="From">
          <CoinsComponent coins={[coinIn]} />
        </DecodeMessageRow>
        <DecodeMessageRow title="To">
          <CoinsComponent coins={[coinOut]} />
        </DecodeMessageRow>
        <DecodeMessageExecute log={log} msgBody={msgBody} />
      </DecodeMessageBody>
    </Flex>
  );
};
