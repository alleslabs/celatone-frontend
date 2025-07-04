import type { TxData } from "lib/services/types";
import type { Nullish } from "lib/types";

import {
  Alert,
  AlertDescription,
  Flex,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useEvmConfig } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { DecodeMessage } from "lib/components/decode-message";
import { CustomIcon } from "lib/components/icon";
import { useState } from "react";

import { TxMessage } from "../../../components/tx-message";
import { BalanceChanges } from "./balance-changes";
import { EvmRelatedTxSection } from "./evm-related-tx-section";

interface MessageSectionProps {
  relatedEvmTxHash: Nullish<string>;
  txData: TxData;
}

enum MessageSectionTab {
  Message = "message",
  BalanceChange = "balanceChange",
}

export const MessageSection = ({
  relatedEvmTxHash,
  txData,
}: MessageSectionProps) => {
  const [tab, setTab] = useState(MessageSectionTab.Message);
  const evm = useEvmConfig({ shouldRedirect: false });

  const {
    decodedTx,
    logs,
    tx: {
      body: { messages },
    },
  } = txData;

  return (
    <Flex direction="column" flex={1} gap={4} w="full">
      {txData.isTxFailed && (
        <Alert alignItems="center" mb={2} variant="error">
          <Flex align="start" gap={2}>
            <CustomIcon
              boxSize={4}
              color="error.main"
              name="alert-triangle-solid"
            />
            <AlertDescription wordBreak="break-word">
              {txData.rawLog}
            </AlertDescription>
          </Flex>
        </Alert>
      )}
      {relatedEvmTxHash && <EvmRelatedTxSection evmTxHash={relatedEvmTxHash} />}
      <Tabs
        index={Object.values(MessageSectionTab).indexOf(tab)}
        isLazy
        lazyBehavior="keepMounted"
      >
        <TabList
          borderBottomWidth="1px"
          borderColor="gray.700"
          overflowX="scroll"
        >
          <CustomTab
            count={messages.length}
            onClick={() => setTab(MessageSectionTab.Message)}
          >
            {evm.enabled ? "Cosmos " : ""}Messages
          </CustomTab>
          <CustomTab onClick={() => setTab(MessageSectionTab.BalanceChange)}>
            Balance changes
          </CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            {messages.map((msg, idx) =>
              decodedTx.messages[idx] ? (
                <DecodeMessage
                  key={JSON.stringify(msg) + idx.toString()}
                  compact={false}
                  decodedMessage={decodedTx.messages[idx].decodedMessage}
                  log={logs[idx]}
                  msgBody={msg}
                  msgCount={messages.length}
                />
              ) : (
                <TxMessage
                  key={JSON.stringify(msg) + idx.toString()}
                  compact={false}
                  log={logs[idx]}
                  msgBody={msg}
                  msgCount={messages.length}
                />
              )
            )}
          </TabPanel>
          <TabPanel px={0}>
            <BalanceChanges
              totalBalanceChanges={decodedTx.totalBalanceChanges}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};
