import type { DecodedMessage } from "@initia/tx-decoder";

import { Flex, Text } from "@chakra-ui/react";
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
import { DecodeMessageHeader } from "./decode-message-header";
import { DecodeMessageRow } from "./decode-message-row";

interface DecodeMessageSendProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "send";
  };
}

export const DecodeMessageSend = ({
  decodedMessage,
  isSingleMsg,
  log,
  msgBody,
}: DecodeMessageSendProps) => {
  const [expand, setExpand] = useState(!!isSingleMsg);
  const getAddressType = useGetAddressType();
  const { data } = decodedMessage;
  const coin = data.coins[0];
  const { data: assetInfos } = useAssetInfos({ withPrices: false });
  const token = coinToTokenWithValue(coin.denom, coin.amount, assetInfos);
  const tokenWithValue = formatTokenWithValue(token);

  return (
    <Flex direction="column">
      <DecodeMessageHeader
        gap={2}
        iconName="send"
        isExpand={expand}
        isIbc={decodedMessage.isIbc}
        isSingleMsg={!!isSingleMsg}
        label="Send"
        type={msgBody["@type"]}
        onClick={() => setExpand(!expand)}
      >
        <Flex align="center" gap={1}>
          <TokenImageRender
            alt={getTokenLabel(token.denom, token.symbol)}
            boxSize={4}
            logo={token.logo}
          />
          <Text>{tokenWithValue}</Text>
        </Flex>
        <Text color="text.dark">form</Text>
        <ExplorerLink
          showCopyOnHover
          textVariant="body1"
          type={getAddressType(data.from)}
          value={data.from}
        />
        <Text color="text.dark">to</Text>
        <ExplorerLink
          showCopyOnHover
          textVariant="body1"
          type={getAddressType(data.to)}
          value={data.to}
        />
      </DecodeMessageHeader>
      <DecodeMessageBody isExpand={expand} log={log}>
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
        <DecodeMessageRow title="Receiver">
          <ExplorerLink
            maxWidth="full"
            showCopyOnHover
            textFormat="normal"
            type={getAddressType(data.to)}
            value={data.to}
            wordBreak="break-word"
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="Amount">
          <CoinsComponent coins={data.coins} />
        </DecodeMessageRow>
      </DecodeMessageBody>
    </Flex>
  );
};
