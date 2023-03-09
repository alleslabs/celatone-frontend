import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Flex,
  Text,
} from "@chakra-ui/react";

import type { TxData } from "lib/services/txService";

import { TxMessage } from "./tx-message";

interface MessageSectionProps {
  txData: TxData;
}

export const MessageSection = ({ txData }: MessageSectionProps) => {
  const isTxFailed = Boolean(txData.code);
  const msgs = txData.tx.body.messages;
  return (
    <Flex direction="column" flex={0.98} gap={4}>
      {isTxFailed && (
        <Alert variant="error" mb={2} alignItems="center">
          <AlertIcon />
          <AlertDescription>{txData.raw_log}</AlertDescription>
        </Alert>
      )}
      <Flex align="center" gap={2}>
        <Text variant="body1" fontSize="18px" fontWeight={500}>
          Messages
        </Text>
        <Badge variant="gray" textAlign="center">
          {msgs.length}
        </Badge>
      </Flex>
      {msgs.map((msg, idx) => {
        const msgLog = txData.logs.find((log) => log.msg_index === idx);
        return (
          <TxMessage
            key={msg.type + msg.value + (msgLog?.msg_index?.toString() || "0")}
            msgBody={msg}
            log={msgLog}
            isSingleMsg={msgs.length === 1}
          />
        );
      })}
    </Flex>
  );
};
