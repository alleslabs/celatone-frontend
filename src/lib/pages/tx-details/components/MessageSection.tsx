import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Flex,
  Heading,
} from "@chakra-ui/react";

import type { AssetInfosOpt } from "lib/services/assetService";
import type { TxData } from "lib/services/txService";

import { TxMessage } from "./tx-message";

interface MessageSectionProps {
  txData: TxData;
  assetInfos: AssetInfosOpt;
}

export const MessageSection = ({ txData, assetInfos }: MessageSectionProps) => {
  const msgs = txData.tx.body.messages;
  return (
    <Flex direction="column" flex={1} gap={4}>
      {txData.isTxFailed && (
        <Alert variant="error" mb={2} alignItems="center">
          <AlertIcon />
          <AlertDescription>{txData.raw_log}</AlertDescription>
        </Alert>
      )}
      <Flex align="center" gap={2}>
        <Heading as="h6" variant="h6">
          Messages
        </Heading>
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
            assetInfos={assetInfos}
          />
        );
      })}
    </Flex>
  );
};
