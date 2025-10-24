import type { Log } from "@cosmjs/stargate/build/logs";
import type { DecodedCosmosMirrorCall } from "@initia/tx-decoder";
import type { Option } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";

import { DecodeMessageHeader } from "../decode-message-header";

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
  const {
    data: { cosmosTxHash },
  } = decodedTransaction;

  return (
    <Flex direction="column" w="100%">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
        isExpand={false}
        isIbc={false}
        isOpinit={false}
        isSingleMsg={msgCount === 1}
        label="Cosmos mirror"
        msgCount={msgCount}
        type={decodedTransaction.action}
      >
        <Flex align="center" gap={2}>
          <Text color="text.dark">of</Text>
          <ExplorerLink showCopyOnHover type="tx_hash" value={cosmosTxHash} />
        </Flex>
      </DecodeMessageHeader>
    </Flex>
  );
};
