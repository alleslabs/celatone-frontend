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
  getTokenLabel,
} from "lib/utils";
import { useState } from "react";

import type { TxMsgData } from "../tx-message";

import { CoinsComponent } from "../tx-message/msg-receipts/CoinsComponent";
import { DecodeMessageBody } from "./decode-message-body";
import { DecodeMessageHeader } from "./decode-message-header";
import { DecodeMessageRow } from "./decode-message-row";

interface DecodedMessageRedelegateProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "redelegate";
  };
}

export const DecodedMessageRedelegate = ({
  compact,
  decodedMessage,
  log,
  msgBody,
  msgCount,
}: DecodedMessageRedelegateProps) => {
  const isSingleMsg = msgCount === 1;
  const [expand, setExpand] = useState(!!isSingleMsg);
  const getAddressType = useGetAddressType();
  const { data, isIbc, isOp } = decodedMessage;
  const coin = data.coins[0];
  const { data: assetInfos } = useAssetInfos({ withPrices: false });
  const token = coinToTokenWithValue(coin.denom, coin.amount, assetInfos);
  const tokenWithValue = formatTokenWithValue(token);

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
        label="Redelegate"
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
            identity: data.validatorSrc?.description.identity,
            moniker: data.validatorSrc?.description.moniker,
            validatorAddress: zValidatorAddr.parse(data.validatorSrcAddress),
          }}
        />
        <Text color="text.dark">to</Text>
        <ValidatorBadge
          badgeSize={4}
          hasLabel={false}
          sx={{
            width: "fit-content",
          }}
          validator={{
            identity: data.validatorDst?.description.identity,
            moniker: data.validatorDst?.description.moniker,
            validatorAddress: zValidatorAddr.parse(data.validatorDstAddress),
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
        <DecodeMessageRow title="Claimer">
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
              identity: data.validatorSrc?.description.identity,
              moniker: data.validatorSrc?.description.moniker,
              validatorAddress: zValidatorAddr.parse(data.validatorSrcAddress),
            }}
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="To validator">
          <ValidatorBadge
            badgeSize={4}
            sx={{
              width: "fit-content",
            }}
            validator={{
              identity: data.validatorDst?.description.identity,
              moniker: data.validatorDst?.description.moniker,
              validatorAddress: zValidatorAddr.parse(data.validatorDstAddress),
            }}
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="Amount">
          <CoinsComponent coins={data.coins} />
        </DecodeMessageRow>
      </DecodeMessageBody>
    </Flex>
  );
};
