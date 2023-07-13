import {
  Alert,
  AlertDescription,
  Badge,
  Flex,
  Heading,
} from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
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
        <Badge>{msgs.length}</Badge>
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
