import type { DecodedMessage } from "@initia/tx-decoder";

import { Flex, Text } from "@chakra-ui/react";
import { TokenImageRender } from "lib/components/token";
import { useAssetInfos } from "lib/services/assetService";
import {
  coinToTokenWithValue,
  formatTokenWithValue,
  getTokenLabel,
} from "lib/utils";
import { useState } from "react";

import type { TxMsgData } from "../tx-message";

import { DecodeMessageBody } from "./decode-message-body";
import { DecodeMessageHeader } from "./decode-message-header";

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
  const [expand, setExpand] = useState(!!isSingleMsg);
  const { data, isIbc, isOp } = decodedMessage;
  const { data: assetInfos } = useAssetInfos({ withPrices: false });
  const token = coinToTokenWithValue(data.denom, data.amount, assetInfos);
  const tokenWithValue = formatTokenWithValue(token);

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
        <Text color="text.dark">from</Text>
      </DecodeMessageHeader>
      <DecodeMessageBody compact={compact} isExpand={expand} log={log}>
        body
      </DecodeMessageBody>
    </Flex>
  );
};
