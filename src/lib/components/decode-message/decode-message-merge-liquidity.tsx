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

interface DecodeMessageMergeLiquidityProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "merge_liquidity";
  };
}

export const DecodeMessageMergeLiquidity = ({
  compact,
  decodedMessage,
  log,
  msgBody,
  msgCount,
}: DecodeMessageMergeLiquidityProps) => {
  const isSingleMsg = msgCount === 1;
  const [expand, setExpand] = useState(!!isSingleMsg);
  const { data, isIbc, isOp } = decodedMessage;

  const parsedReleaseTimestamp = parseUnixToDateOpt(data.newReleaseTimestamp);

  return (
    <Flex direction="column" maxW="inherit">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
        isExpand={expand}
        isIbc={isIbc}
        isOpinit={isOp}
        isSingleMsg={!!isSingleMsg}
        label="Merge"
        msgCount={msgCount}
        type={msgBody["@type"]}
        onClick={() => setExpand(!expand)}
      >
        <Text color="text.dark">+</Text>
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
        <DecodeMessageRow title="Merged Assets">-</DecodeMessageRow>
        {parsedReleaseTimestamp && (
          <DecodeMessageRow title="Release timestamp">
            {formatUTC(parsedReleaseTimestamp)}
          </DecodeMessageRow>
        )}
      </DecodeMessageBody>
    </Flex>
  );
};
