import {
  Alert,
  AlertDescription,
  Badge,
  Flex,
  Heading,
} from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import type { TxData } from "lib/services/txService";

import { TxMessage } from "./tx-message";

interface MessageSectionProps {
  txData: TxData;
}

export const MessageSection = ({ txData }: MessageSectionProps) => {
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
              name="alert-circle-solid"
              color="error.main"
              boxSize={4}
            />
            <AlertDescription wordBreak="break-word">
              {txData.raw_log}
            </AlertDescription>
          </Flex>
        </Alert>
      )}
      <Flex align="center" gap={2}>
        <Heading as="h6" variant="h6">
          Messages
        </Heading>
        <Badge>{messages.length}</Badge>
      </Flex>
      {messages.map((msg, idx) => (
        <TxMessage
          key={msg.type + msg.value + idx.toString()}
          msgBody={msg}
          log={logs[idx]}
          isSingleMsg={messages.length === 1}
        />
      ))}
    </Flex>
  );
};
