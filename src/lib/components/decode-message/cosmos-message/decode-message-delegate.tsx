import type { DecodedMessage } from "@initia/tx-decoder";

import { Flex, Text } from "@chakra-ui/react";
import { useGetAddressType } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TokenImageWithAmount } from "lib/components/token";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import { useAssetInfos } from "lib/services/assetService";
import { zValidatorAddr } from "lib/types";
import { coinToTokenWithValue, formatUTC, parseUnixToDateOpt } from "lib/utils";
import { memo, useState } from "react";

import type { TxMsgData } from "../../tx-message";

import { CoinsComponent } from "../../tx-message/msg-receipts/CoinsComponent";
import { DecodeMessageBody } from "../decode-message-body";
import { DecodeMessageExecute } from "../decode-message-execute";
import { DecodeMessageHeader } from "../decode-message-header";
import { DecodeMessageRow } from "../decode-message-row";

interface DecodeMessageDelegateProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "delegate";
  };
}

export const DecodeMessageDelegate = memo(
  ({
    compact,
    decodedMessage,
    log,
    msgBody,
    msgCount,
  }: DecodeMessageDelegateProps) => {
    const isSingleMsg = msgCount === 1;
    const [expand, setExpand] = useState(!!isSingleMsg);
    const getAddressType = useGetAddressType();
    const { data, isIbc, isOp } = decodedMessage;
    const coin = data.coins[0];
    const { data: assetInfos } = useAssetInfos({ withPrices: false });
    const token = coinToTokenWithValue(coin.denom, coin.amount, assetInfos);

    const isLocked = [
      "/initia.move.v1.MsgExecute",
      "/initia.move.v1.MsgExecuteJSON",
    ].includes(msgBody["@type"]);
    const parsedReleaseTimestamp = parseUnixToDateOpt(data.releaseTimestamp);

    return (
      <Flex direction="column" maxW="inherit">
        <DecodeMessageHeader
          compact={compact}
          gap={2}
          isExpand={expand}
          isIbc={isIbc}
          isOpinit={isOp}
          isSingleMsg={!!isSingleMsg}
          label={isLocked ? "Lock stake" : "Stake"}
          msgCount={msgCount}
          type={msgBody["@type"]}
          onClick={() => setExpand(!expand)}
        >
          <TokenImageWithAmount token={token} />
          <Text color="text.dark">to</Text>
          <ValidatorBadge
            badgeSize={4}
            fixedHeight={compact}
            hasLabel={false}
            sx={{
              width: "fit-content",
            }}
            textFormat={!compact ? "normal" : "ellipsis"}
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
  }
);
