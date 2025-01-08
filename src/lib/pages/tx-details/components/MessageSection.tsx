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
  relatedEvmTxHash: Nullish<string>;
  txData: TxData;
}

export const MessageSection = ({
  relatedEvmTxHash,
  txData,
}: MessageSectionProps) => {
  const evm = useEvmConfig({ shouldRedirect: false });

  const {
    logs,
    tx: {
      body: { messages },
    },
  } = txData;

  return (
    <Flex flex={1} gap={4} w="full" direction="column">
      {txData.isTxFailed && (
        <Alert alignItems="center" mb={2} variant="error">
          <Flex align="start" gap={2}>
            <CustomIcon
              name="alert-triangle-solid"
              boxSize={4}
              color="error.main"
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
          isSingleMsg={messages.length === 1}
          log={logs[idx]}
          msgBody={msg}
        />
      ))}
    </Flex>
  );
};
