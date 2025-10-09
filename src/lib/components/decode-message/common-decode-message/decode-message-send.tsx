import type { Coin } from "@cosmjs/amino";
import type { DecodedMessage } from "@initia/tx-decoder";
import type { TxMsgData } from "lib/components/tx-message";
import type { AssetInfos, Option } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { useGetAddressType } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TokenImageRender } from "lib/components/token";
import { TokenImageWithAmount } from "lib/components/token/TokenImageWithAmount";
import { CoinsComponent } from "lib/components/tx-message/msg-receipts/CoinsComponent";
import { useAssetInfos } from "lib/services/assetService";
import { coinToTokenWithValue, getTokenLabel } from "lib/utils";

import { DecodeMessageRow } from "../decode-message-row";

const DecodeMessageSendSingleCoinHeader = ({
  assetInfos,
  coin,
}: {
  assetInfos: Option<AssetInfos>;
  coin: Coin;
}) => {
  const token = coinToTokenWithValue(coin.denom, coin.amount, assetInfos);
  return <TokenImageWithAmount token={token} />;
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
          <Flex key={coin.denom} align="center" marginInlineEnd="-4px">
            <TokenImageRender
              alt={getTokenLabel(token.denom, token.symbol)}
              boxSize={4}
              logo={token.logo}
              minW={4}
            />
          </Flex>
        );
      })}
    </Flex>
    <Text whiteSpace="nowrap">{coins.length} assets</Text>
  </>
);

export interface DecodeMessageSendProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "send";
  };
}

export const DecodeMessageSendHeader = ({
  compact,
  decodedMessage,
}: Pick<DecodeMessageSendProps, "compact" | "decodedMessage">) => {
  const getAddressType = useGetAddressType();
  const { data } = decodedMessage;
  const { data: assetInfos } = useAssetInfos({ withPrices: false });
  const { coins, from, to } = data;

  const hasMultipleCoins = coins.length > 1;
  const firstCoin = coins[0];

  return (
    <>
      <Flex align="center" flexWrap="nowrap" gap={2} minWidth="fit-content">
        {hasMultipleCoins ? (
          <DecodeMessageSendMultipleCoinsHeader
            assetInfos={assetInfos}
            coins={coins}
          />
        ) : firstCoin ? (
          <DecodeMessageSendSingleCoinHeader
            assetInfos={assetInfos}
            coin={firstCoin}
          />
        ) : (
          <Text color="text.dark">No assets</Text>
        )}
      </Flex>
      {!compact && (
        <Flex align="center" gap={2}>
          <Text color="text.dark">from</Text>
          <ExplorerLink
            showCopyOnHover
            textVariant={compact ? "body2" : "body1"}
            type={getAddressType(from)}
            value={from}
          />
        </Flex>
      )}
      <Flex align="center" gap={2}>
        <Text color="text.dark">to</Text>
        <ExplorerLink
          showCopyOnHover
          textVariant={compact ? "body2" : "body1"}
          type={getAddressType(to)}
          value={to}
        />
      </Flex>
    </>
  );
};

export const DecodeMessageSendBody = ({
  decodedMessage,
}: Pick<DecodeMessageSendProps, "decodedMessage">) => {
  const getAddressType = useGetAddressType();
  const { data } = decodedMessage;

  return (
    <>
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
    </>
  );
};
