import type { DecodedMessage } from "@initia/tx-decoder";

import { Flex, Text } from "@chakra-ui/react";
import { useGetAddressType } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TokenImageRender } from "lib/components/token";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import { useAssetInfos } from "lib/services/assetService";
import { zValidatorAddr } from "lib/types";
import {
  coinToTokenWithValue,
  formatTokenWithValue,
  formatUTC,
  getTokenLabel,
  parseUnixToDateOpt,
} from "lib/utils";
import { useState } from "react";

import type { TxMsgData } from "../tx-message";

import { CoinsComponent } from "../tx-message/msg-receipts/CoinsComponent";
import { DecodeMessageBody } from "./decode-message-body";
import { DecodeMessageExecute } from "./decode-message-execute";
import { DecodeMessageHeader } from "./decode-message-header";
import { DecodeMessageRow } from "./decode-message-row";

interface DecodeMessageDelegateProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "delegate";
  };
}

export const DecodeMessageDelegate = ({
  compact,
  decodedMessage,
  isSingleMsg,
  log,
  msgBody,
}: DecodeMessageDelegateProps) => {
  const [expand, setExpand] = useState(!!isSingleMsg);
  const getAddressType = useGetAddressType();
  const { data, isIbc, isOp } = decodedMessage;
  const coin = data.coins[0];
  const { data: assetInfos } = useAssetInfos({ withPrices: false });
  const token = coinToTokenWithValue(coin.denom, coin.amount, assetInfos);
  const tokenWithValue = formatTokenWithValue(token);

  const isLocked = msgBody["@type"] === "/initia.move.v1.MsgExecute";
  const parsedReleaseTimestamp = parseUnixToDateOpt(data.releaseTimestamp);

  return (
    <Flex direction="column">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
        iconName="delegate"
        isExpand={expand}
        isIbc={isIbc}
        isOpinit={isOp}
        isSingleMsg={!!isSingleMsg}
        label={isLocked ? "Lock stake" : "Stake"}
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
        <Text color="text.dark">to</Text>
        <ValidatorBadge
          badgeSize={4}
          hasLabel={false}
          sx={{
            width: "fit-content",
          }}
          validator={{
            identity: data.validator?.description.identity,
            moniker: data.validator?.description.moniker,
            validatorAddress: zValidatorAddr.parse(data.validatorAddress),
          }}
        />
        <Flex gap={2}>
          <Text color="text.dark">by</Text>
          <ExplorerLink
            showCopyOnHover
            textVariant="body1"
            type={getAddressType(data.delegatorAddress)}
            value={data.delegatorAddress}
          />
        </Flex>
      </DecodeMessageHeader>
      <DecodeMessageBody compact={compact} isExpand={expand} log={log}>
        <DecodeMessageRow title="Delegator">
          <ExplorerLink
            maxWidth="full"
            showCopyOnHover
            textFormat="normal"
            type={getAddressType(data.delegatorAddress)}
            value={data.delegatorAddress}
            wordBreak="break-word"
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="Validator">
          <ValidatorBadge
            badgeSize={4}
            sx={{
              width: "fit-content",
            }}
            validator={{
              identity: data.validator?.description.identity,
              moniker: data.validator?.description.moniker,
              validatorAddress: zValidatorAddr.parse(data.validatorAddress),
            }}
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="Amount">
          <CoinsComponent coins={data.coins} />
        </DecodeMessageRow>
        {parsedReleaseTimestamp && (
          <DecodeMessageRow title="Release timestamp">
            {formatUTC(parsedReleaseTimestamp)}
          </DecodeMessageRow>
        )}
        <DecodeMessageExecute log={log} msgBody={msgBody} />
      </DecodeMessageBody>
    </Flex>
  );
};
