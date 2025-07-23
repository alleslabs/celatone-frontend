import type { DecodedMessage } from "@initia/tx-decoder";

import { Flex, Text } from "@chakra-ui/react";
import { Coin } from "@initia/initia.js";
import { useGetAddressType } from "lib/app-provider";
import { TokenImageRender } from "lib/components/token";
import { useAssetInfos } from "lib/services/assetService";
import {
  coinToTokenWithValue,
  formatTokenWithValue,
  formatUTC,
  getTokenLabel,
  parseNanosecondsToDate,
} from "lib/utils";
import { useState } from "react";

import type { TxMsgData } from "../tx-message";

import { ExplorerLink } from "../ExplorerLink";
import JsonReadOnly from "../json/JsonReadOnly";
import { CoinsComponent } from "../tx-message/msg-receipts/CoinsComponent";
import { DecodeMessageBody } from "./decode-message-body";
import { DecodeMessageHeader } from "./decode-message-header";
import { DecodeMessageRow } from "./decode-message-row";

interface DecodeMessageIbcFtProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "ibc_ft_receive" | "ibc_ft_send";
  };
}

export const DecodeMessageIbcFt = ({
  compact,
  decodedMessage,
  log,
  msgBody,
  msgCount,
}: DecodeMessageIbcFtProps) => {
  const isSingleMsg = msgCount === 1;
  const getAddressType = useGetAddressType();
  const [expand, setExpand] = useState(!!isSingleMsg);
  const { data, isIbc, isOp } = decodedMessage;
  const { data: assetInfos } = useAssetInfos({ withPrices: false });
  const token = coinToTokenWithValue(data.denom, data.amount, assetInfos);
  const tokenWithValue = formatTokenWithValue(token);

  return (
    <Flex direction="column" maxW="inherit">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
        iconName="swap"
        isExpand={expand}
        isIbc={isIbc}
        isOpinit={isOp}
        isSingleMsg={!!isSingleMsg}
        label="Bridge"
        msgCount={msgCount}
        type={msgBody["@type"]}
        onClick={() => setExpand(!expand)}
      >
        <Flex align="center" gap={1} minWidth="fit-content">
          <TokenImageRender
            alt={getTokenLabel(token.denom, token.symbol)}
            boxSize={4}
            logo={token.logo}
          />
          <Text whiteSpace="nowrap">{tokenWithValue}</Text>
        </Flex>
        {decodedMessage.action === "ibc_ft_send" ? (
          <Flex align="center" gap={2}>
            <Text color="text.dark">to</Text>
            <Text whiteSpace="nowrap">{data.dstChainId}</Text>
          </Flex>
        ) : (
          <Flex align="center" gap={2}>
            <Text color="text.dark">from</Text>
            <Text whiteSpace="nowrap">{data.srcChainId}</Text>
          </Flex>
        )}
      </DecodeMessageHeader>
      <DecodeMessageBody compact={compact} isExpand={expand} log={log}>
        <DecodeMessageRow title="Source chain">
          <Text>{data.srcChainId}</Text>
        </DecodeMessageRow>
        <DecodeMessageRow title="Sender">
          <ExplorerLink
            maxWidth="full"
            showCopyOnHover
            textFormat="normal"
            type={getAddressType(data.sender)}
            value={data.sender}
            wordBreak="break-word"
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="Destination chain">
          <Text>{data.dstChainId}</Text>
        </DecodeMessageRow>
        <DecodeMessageRow title="Receiver">
          <ExplorerLink
            maxWidth="full"
            showCopyOnHover
            textFormat="normal"
            type={getAddressType(data.receiver)}
            value={data.receiver}
            wordBreak="break-word"
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="Amount">
          <CoinsComponent coins={[new Coin(data.denom, data.amount)]} />
        </DecodeMessageRow>
        <DecodeMessageRow title="Source channel">
          <Text>{data.srcChannel}</Text>
        </DecodeMessageRow>
        <DecodeMessageRow title="Source port">
          <Text>{data.srcPort}</Text>
        </DecodeMessageRow>
        <DecodeMessageRow title="Timeout height">
          <JsonReadOnly
            canCopy
            fullWidth
            isExpandable
            text={JSON.stringify(data.timeoutHeight, null, 2)}
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="Timeout timestamp">
          {formatUTC(parseNanosecondsToDate(data.timeoutTimestamp))}
        </DecodeMessageRow>
      </DecodeMessageBody>
    </Flex>
  );
};
