import type { DecodedMessage } from "@initia/tx-decoder";
import type { AssetInfos, Coin, Option } from "lib/types";

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

const DecodeMessageSendSingleCoinHeader = ({
  assetInfos,
  coin,
}: {
  assetInfos: Option<AssetInfos>;
  coin: Coin;
}) => {
  const token = coinToTokenWithValue(coin.denom, coin.amount, assetInfos);
  const tokenWithValue = formatTokenWithValue(token);

  return (
    <>
      <TokenImageRender
        alt={getTokenLabel(token.denom, token.symbol)}
        boxSize={4}
        logo={token.logo}
      />
      <Text isTruncated whiteSpace="nowrap">
        {tokenWithValue}
      </Text>
    </>
  );
};

const DecodeMessageSendMultipleCoinsHeader = ({
  assetInfos,
  coins,
}: {
  assetInfos: Option<AssetInfos>;
  coins: Coin[];
}) => (
  <>
    <Flex>
      {coins.map((coin) => {
        const token = coinToTokenWithValue(coin.denom, coin.amount, assetInfos);
        return (
          <TokenImageRender
            alt={getTokenLabel(token.denom, token.symbol)}
            boxSize={4}
            logo={token.logo}
            marginInlineEnd="-4px"
          />
        );
      })}
    </Flex>
    <Text whiteSpace="nowrap">{coins.length} assets</Text>
  </>
);

export const DecodeMessageSend = ({
  compact,
  decodedMessage,
  isSingleMsg,
  log,
  msgBody,
}: DecodeMessageSendProps) => {
  const [expand, setExpand] = useState(!!isSingleMsg);
  const getAddressType = useGetAddressType();
  const { data, isIbc, isOp } = decodedMessage;
  const { data: assetInfos } = useAssetInfos({ withPrices: false });

  return (
    <Flex direction="column" w="full">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
        iconName="send"
        isExpand={expand}
        isIbc={isIbc}
        isOpinit={isOp}
        isSingleMsg={!!isSingleMsg}
        label="Send"
        type={msgBody["@type"]}
        onClick={() => setExpand(!expand)}
      >
        <Flex align="center" flexWrap="nowrap" gap={2} minWidth={0}>
          {data.coins.length > 1 ? (
            <DecodeMessageSendMultipleCoinsHeader
              assetInfos={assetInfos}
              coins={data.coins}
            />
          ) : (
            <DecodeMessageSendSingleCoinHeader
              assetInfos={assetInfos}
              coin={data.coins[0]}
            />
          )}
        </Flex>
        {!compact && (
          <Flex gap={2}>
            <Text color="text.dark">from</Text>
            <ExplorerLink
              showCopyOnHover
              textVariant={compact ? "body2" : "body1"}
              type={getAddressType(data.from)}
              value={data.from}
            />
          </Flex>
        )}
        <Flex gap={2}>
          <Text color="text.dark">to</Text>
          <ExplorerLink
            showCopyOnHover
            textVariant={compact ? "body2" : "body1"}
            type={getAddressType(data.to)}
            value={data.to}
          />
        </Flex>
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
