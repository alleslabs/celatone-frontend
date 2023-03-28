import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Flex,
  Text,
} from "@chakra-ui/react";

import type { AssetInfosReturn } from "lib/services/assetService";
import type { TxData } from "lib/services/txService";

import { TxMessage } from "./tx-message";

interface MessageSectionProps {
  txData: TxData;
  assetInfos: AssetInfosReturn;
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
            assetInfos={assetInfos}
          />
        );
      })}
    </Flex>
  );
};
