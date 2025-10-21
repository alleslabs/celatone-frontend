import type { Log } from "@cosmjs/stargate/build/logs";
import type { DecodedCosmosMirrorCall } from "@initia/tx-decoder";
import type { Option } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";

import { DecodeMessageBody } from "../decode-message-body";
import { DecodeMessageHeader } from "../decode-message-header";
import { DecodeMessageRow } from "../decode-message-row";

interface DecodeEvmMessageCosmosMirrorProps {
  compact: boolean;
  decodedTransaction: DecodedCosmosMirrorCall;
  log: Option<Log>;
  msgCount: number;
}

export const DecodeEvmMessageCosmosMirrorHeader = ({
  compact,
  decodedTransaction,
  msgCount,
}: DecodeEvmMessageCosmosMirrorProps) => {
  const { cosmosTxHash, evmTxHash } = decodedTransaction.data;

  return (
    <Flex direction="column" w="100%">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
        isExpand
        isIbc={false}
        isOpinit={false}
        isSingleMsg={msgCount === 1}
        label="Cosmos mirror"
        msgCount={msgCount}
        type={decodedTransaction.action}
      >
        <Text color="text.dark" whiteSpace="nowrap">
          Cosmos Tx:
        </Text>
        <ExplorerLink showCopyOnHover type="tx_hash" value={cosmosTxHash} />
        <Text color="text.dark" whiteSpace="nowrap">
          EVM Tx:
        </Text>
        <ExplorerLink showCopyOnHover type="tx_hash" value={evmTxHash} />
      </DecodeMessageHeader>
    </Flex>
  );
};

export const DecodeEvmMessageCosmosMirrorBody = ({
  compact,
  decodedTransaction,
}: DecodeEvmMessageCosmosMirrorProps) => {
  const { cosmosMessages, cosmosTxHash, evmTxHash } = decodedTransaction.data;

  return (
    <DecodeMessageBody
      compact={compact}
      isExpand
      log={undefined}
      sx={{
        pl: 0,
      }}
    >
      <DecodeMessageRow title="Cosmos Tx Hash">
        <ExplorerLink
          showCopyOnHover
          textFormat="normal"
          type="tx_hash"
          value={cosmosTxHash}
        />
      </DecodeMessageRow>
      <DecodeMessageRow title="EVM Tx Hash">
        <ExplorerLink
          showCopyOnHover
          textFormat="normal"
          type="tx_hash"
          value={evmTxHash}
        />
      </DecodeMessageRow>
      <DecodeMessageRow title="Cosmos Messages">
        <Text color="text.main">
          {cosmosMessages.length}{" "}
          {cosmosMessages.length === 1 ? "message" : "messages"}
        </Text>
      </DecodeMessageRow>
    </DecodeMessageBody>
  );
};
