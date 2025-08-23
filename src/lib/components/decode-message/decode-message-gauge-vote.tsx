import type { DecodedMessage } from "@initia/tx-decoder";

import { Flex, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { formatDecimal } from "lib/utils";
import { useState } from "react";

import type { TxMsgData } from "../tx-message";

import { ChainBadge } from "../ChainBadge";
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

  const chainIds = data.votes.map((vote) => vote.rollup);

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
        <Text>
          {formatDecimal({
            decimalPoints: 6,
            delimiter: true,
          })(data.votingPower, "0")}
        </Text>
        <Text color="text.dark">for</Text>
        <ChainBadge chainId={chainIds} />
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
        <DecodeMessageRow title="Epoch">{data.epoch}</DecodeMessageRow>
        <DecodeMessageRow title="Voted for">
          <Flex direction="column" gap={2} w="full">
            {data.votes.map(({ amount, rollup }) => (
              <Flex
                key={rollup}
                align="center"
                bg="gray.800"
                borderRadius={4}
                justifyContent="space-between"
                px={3}
                py={2}
                w="full"
              >
                <ChainBadge chainId={rollup} />
                <Flex align="center" gap={2}>
                  <Text variant="body2">{amount}</Text>
                  <Text color="text.dark" variant="body2">
                    voting power
                  </Text>
                </Flex>
              </Flex>
            ))}
          </Flex>
        </DecodeMessageRow>
      </DecodeMessageBody>
    </Flex>
  );
};
