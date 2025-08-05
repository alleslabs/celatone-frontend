import type { DecodedMessage } from "@initia/tx-decoder";

import { Flex, Text } from "@chakra-ui/react";
import { zValidatorAddr } from "lib/types";
import { formatUTC, parseUnixToDateOpt } from "lib/utils";
import { useState } from "react";

import type { TxMsgData } from "../tx-message";

import { ExplorerLink } from "../ExplorerLink";
import { ValidatorBadge } from "../ValidatorBadge";
import { DecodeMessageBody } from "./decode-message-body";
import { DecodeMessageHeader } from "./decode-message-header";
import { DecodeMessageRow } from "./decode-message-row";

interface DecodeMessageExtendLiquidityProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "extend_liquidity";
  };
}

export const DecodeMessageExtendLiquidity = ({
  compact,
  decodedMessage,
  log,
  msgBody,
  msgCount,
}: DecodeMessageExtendLiquidityProps) => {
  const isSingleMsg = msgCount === 1;
  const [expand, setExpand] = useState(!!isSingleMsg);
  const { data, isIbc, isOp } = decodedMessage;

  const parsedNewReleaseTimestamp = parseUnixToDateOpt(
    data.newReleaseTimestamp
  );

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
        label="Extend"
        msgCount={msgCount}
        type={msgBody["@type"]}
        onClick={() => setExpand(!expand)}
      >
        <Text color="text.dark">for</Text>
      </DecodeMessageHeader>
      <DecodeMessageBody compact={compact} isExpand={expand} log={log}>
        <DecodeMessageRow title="Address">
          <ExplorerLink
            maxWidth="full"
            showCopyOnHover
            textFormat="normal"
            type="user_address"
            value={data.from}
            wordBreak="break-word"
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="Pool">-</DecodeMessageRow>
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
        <DecodeMessageRow title="Assets">-</DecodeMessageRow>
        <DecodeMessageRow title="Extended period">-</DecodeMessageRow>
        {parsedNewReleaseTimestamp && (
          <DecodeMessageRow title="Release timestamp">
            {formatUTC(parsedNewReleaseTimestamp)}
          </DecodeMessageRow>
        )}
      </DecodeMessageBody>
    </Flex>
  );
};
