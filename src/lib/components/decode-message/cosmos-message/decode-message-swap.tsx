import type { DecodedMessage } from "@initia/tx-decoder";

import { Flex, Text } from "@chakra-ui/react";
import { Coin } from "@initia/initia.js";
import { useGetAddressType } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TokenImageWithAmount } from "lib/components/token";
import { useAssetInfos } from "lib/services/assetService";
import { coinToTokenWithValue } from "lib/utils";
import { memo, useMemo, useState } from "react";

import type { TxMsgData } from "../../tx-message";

import { CoinsComponent } from "../../tx-message/msg-receipts/CoinsComponent";
import { DecodeMessageBody } from "../decode-message-body";
import { DecodeMessageExecute } from "../decode-message-execute";
import { DecodeMessageHeader } from "../decode-message-header";
import { DecodeMessageRow } from "../decode-message-row";

interface DecodeMessageSwapProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "swap";
  };
}

export const DecodeMessageSwap = memo(
  ({
    compact,
    decodedMessage,
    log,
    msgBody,
    msgCount,
  }: DecodeMessageSwapProps) => {
    const isSingleMsg = msgCount === 1;
    const [expand, setExpand] = useState(isSingleMsg);
    const getAddressType = useGetAddressType();
    const { data, isIbc, isOp } = decodedMessage;
    const { data: assetInfos } = useAssetInfos({ withPrices: false });

    const tokenIn = useMemo(
      () => coinToTokenWithValue(data.denomIn, data.amountIn, assetInfos),
      [data.denomIn, data.amountIn, assetInfos]
    );
    const coinIn = useMemo(
      () => new Coin(data.denomIn, data.amountIn),
      [data.denomIn, data.amountIn]
    );

    const tokenOut = useMemo(
      () => coinToTokenWithValue(data.denomOut, data.amountOut, assetInfos),
      [data.denomOut, data.amountOut, assetInfos]
    );
    const coinOut = useMemo(
      () => new Coin(data.denomOut, data.amountOut),
      [data.denomOut, data.amountOut]
    );

    return (
      <Flex direction="column" maxW="inherit">
        <DecodeMessageHeader
          compact={compact}
          gap={2}
          isExpand={expand}
          isIbc={isIbc}
          isOpinit={isOp}
          isSingleMsg={!!isSingleMsg}
          label="Swap"
          msgCount={msgCount}
          type={msgBody["@type"]}
          onClick={() => setExpand(!expand)}
        >
          <TokenImageWithAmount token={tokenIn} />
          <Flex align="center" gap={2} minWidth="fit-content">
            <Text color="text.dark">for</Text>
            <TokenImageWithAmount token={tokenOut} />
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
  }
);
