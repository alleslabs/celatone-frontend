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

interface DecodeMessageUndelegateProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "undelegate";
  };
}

export const DecodeMessageUndelegate = ({
  compact,
  decodedMessage,
  log,
  msgBody,
  msgCount,
}: DecodeMessageUndelegateProps) => {
  const isSingleMsg = msgCount === 1;
  const [expand, setExpand] = useState(!!isSingleMsg);
  const getAddressType = useGetAddressType();
  const { data, isIbc, isOp } = decodedMessage;
  const coin = data.coins[0];
  const { data: assetInfos } = useAssetInfos({ withPrices: false });
  const token = coinToTokenWithValue(coin.denom, coin.amount, assetInfos);
  const tokenWithValue = formatTokenWithValue(token);

  const parsedUnlockTimestamp = parseUnixToDateOpt(data.unlockTimestamp);

  return (
    <Flex direction="column" maxW="inherit">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
        iconName="delegate"
        isExpand={expand}
        isIbc={isIbc}
        isOpinit={isOp}
        isSingleMsg={!!isSingleMsg}
        label="Unstake"
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
        {!compact && (
          <Flex align="center" gap={2}>
            <Text color="text.dark">by</Text>
            <ExplorerLink
              showCopyOnHover
              textVariant="body1"
              type={getAddressType(data.delegatorAddress)}
              value={data.delegatorAddress}
            />
          </Flex>
        )}
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
        <DecodeMessageRow title="From validator">
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
        {parsedUnlockTimestamp && (
          <DecodeMessageRow title="Unlock timestamp">
            {formatUTC(parsedUnlockTimestamp)}
          </DecodeMessageRow>
        )}
        <DecodeMessageExecute log={log} msgBody={msgBody} />
      </DecodeMessageBody>
    </Flex>
  );
};
