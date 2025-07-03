import type { DecodedMessage } from "@initia/tx-decoder";

import { Flex, Text } from "@chakra-ui/react";
import { useGetAddressType } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { useState } from "react";

import type { TxMsgData } from "../tx-message";

import { DecodeMessageBody } from "./decode-message-body";
import { DecodeMessageHeader } from "./decode-message-header";
import { DecodeMessageRow } from "./decode-message-row";

interface DecodeMessageObjectTransferProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "object_transfer";
  };
}

export const DecodeMessageObjectTransfer = ({
  compact,
  decodedMessage,
  isSingleMsg,
  log,
  msgBody,
}: DecodeMessageObjectTransferProps) => {
  const [expand, setExpand] = useState(!!isSingleMsg);
  const getAddressType = useGetAddressType();
  const { data, isIbc, isOp } = decodedMessage;

  return (
    <Flex direction="column">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
        iconName="collection"
        isExpand={expand}
        isIbc={isIbc}
        isOpinit={isOp}
        isSingleMsg={!!isSingleMsg}
        label="NFT Transfer"
        type={msgBody["@type"]}
        onClick={() => setExpand(!expand)}
      >
        <Flex gap={2}>
          <Text color="text.dark">from</Text>
          <ExplorerLink
            showCopyOnHover
            textVariant="body1"
            type={getAddressType(data.from)}
            value={data.from}
          />
        </Flex>
        <Flex gap={2}>
          <Text color="text.dark">to</Text>
          <ExplorerLink
            showCopyOnHover
            textVariant="body1"
            type={getAddressType(data.to)}
            value={data.to}
          />
        </Flex>
      </DecodeMessageHeader>
      <DecodeMessageBody compact={compact} isExpand={expand} log={log}>
        <DecodeMessageRow title="Sender">
          <ExplorerLink
            maxWidth="full"
            showCopyOnHover
            textFormat="normal"
            type={getAddressType(data.from)}
            value={data.from}
            wordBreak="break-word"
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="Receiver">
          <ExplorerLink
            maxWidth="full"
            showCopyOnHover
            textFormat="normal"
            type={getAddressType(data.to)}
            value={data.to}
            wordBreak="break-word"
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="Collection">-</DecodeMessageRow>
        <DecodeMessageRow title="NFT">-</DecodeMessageRow>
      </DecodeMessageBody>
    </Flex>
  );
};
