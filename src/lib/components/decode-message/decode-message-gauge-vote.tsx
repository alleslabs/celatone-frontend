import type { DecodedMessage } from "@initia/tx-decoder";

import { Flex, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { formatInteger } from "lib/utils";
import { useState } from "react";

import type { TxMsgData } from "../tx-message";

import { DecodeMessageBody } from "./decode-message-body";
import { DecodeMessageHeader } from "./decode-message-header";
import { DecodeMessageRow } from "./decode-message-row";

interface DecodeMessageGaugeVoteProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "vip_gauge_vote";
  };
}

export const DecodeMessageGaugeVote = ({
  compact,
  decodedMessage,
  log,
  msgBody,
  msgCount,
}: DecodeMessageGaugeVoteProps) => {
  const isSingleMsg = msgCount === 1;
  const [expand, setExpand] = useState(!!isSingleMsg);
  const { data, isIbc, isOp } = decodedMessage;

  const sumVotingPower = data.votes.reduce((acc, vote) => acc + vote.amount, 0);

  return (
    <Flex direction="column" maxW="inherit">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
        isExpand={expand}
        isIbc={isIbc}
        isOpinit={isOp}
        isSingleMsg={!!isSingleMsg}
        label="VIP Gauge Vote"
        msgCount={msgCount}
        type={msgBody["@type"]}
        onClick={() => setExpand(!expand)}
      >
        <Text>{formatInteger(sumVotingPower)}</Text>
        <Text color="text.dark">for</Text>
        {/* Add rollup image */}
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
        <DecodeMessageRow title="Epoch">-</DecodeMessageRow>
        <DecodeMessageRow title="Voted for">-</DecodeMessageRow>
      </DecodeMessageBody>
    </Flex>
  );
};
