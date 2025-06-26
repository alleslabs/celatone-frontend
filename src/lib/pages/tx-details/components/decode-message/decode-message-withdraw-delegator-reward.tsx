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

interface DecodedMessageWithdrawDelegatorRewardProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "withdraw_delegator_reward";
  };
}

export const DecodedMessageWithdrawDelegatorReward = ({
  decodedMessage,
  isSingleMsg,
  log,
  msgBody,
}: DecodedMessageWithdrawDelegatorRewardProps) => {
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
        iconName="assets-solid"
        isExpand={expand}
        isIbc={decodedMessage.isIbc}
        isSingleMsg={!!isSingleMsg}
        label="Claim"
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
        <Text color="text.dark">from</Text>
        {/* // TODO: add validator */}
        <Text color="text.dark">by</Text>
        <ExplorerLink
          showCopyOnHover
          textVariant="body1"
          type={getAddressType(data.from)}
          value={data.from}
        />
      </DecodeMessageHeader>
      <DecodeMessageBody isExpand={expand} log={log}>
        <DecodeMessageRow title="Claimer">
          <ExplorerLink
            maxWidth="full"
            showCopyOnHover
            textFormat="normal"
            type={getAddressType(data.from)}
            value={data.from}
            wordBreak="break-word"
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="From validator">Add here</DecodeMessageRow>
        <DecodeMessageRow title="Amount">
          <CoinsComponent coins={data.coins} />
        </DecodeMessageRow>
      </DecodeMessageBody>
    </Flex>
  );
};
