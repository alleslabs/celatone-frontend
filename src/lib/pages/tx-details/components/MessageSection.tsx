import {
  Alert,
  AlertDescription,
  Badge,
  Flex,
  Heading,
} from "@chakra-ui/react";

import { useEvmConfig } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import type { TxData } from "lib/services/types";
import type { Nullish } from "lib/types";

import { EvmRelatedTxSection } from "./evm-related-tx-section";
import { TxMessage } from "./tx-message";

interface MessageSectionProps {
  txData: TxData;
  relatedEvmTxHash: Nullish<string>;
}

export const MessageSection = ({
  txData,
  relatedEvmTxHash,
}: MessageSectionProps) => {
  const evm = useEvmConfig({ shouldRedirect: false });

  const {
    tx: {
      body: { messages },
    },
    logs,
  } = txData;

  return (
    <Flex direction="column" flex={1} gap={4} w="full">
      {txData.isTxFailed && (
        <Alert variant="error" mb={2} alignItems="center">
          <Flex gap={2} align="start">
            <CustomIcon
              name="alert-triangle-solid"
              color="error.main"
              boxSize={4}
            />
            <AlertDescription wordBreak="break-word">
              {txData.rawLog}
            </AlertDescription>
          </Flex>
        </Alert>
      )}
      {relatedEvmTxHash && <EvmRelatedTxSection evmTxHash={relatedEvmTxHash} />}
      <Flex align="center" gap={2}>
        <Heading as="h6" variant="h6">
          {evm.enabled ? "Cosmos " : ""}Messages
        </Heading>
        <Badge>{messages.length}</Badge>
      </Flex>
      {messages.map((msg, idx) => (
        <TxMessage
          key={JSON.stringify(msg) + idx.toString()}
          msgBody={msg}
          log={logs[idx]}
          isSingleMsg={messages.length === 1}
        />
      ))}
    </Flex>
  );
};
