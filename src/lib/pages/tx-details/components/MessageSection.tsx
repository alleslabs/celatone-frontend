import type { TxData } from "lib/services/types";
import type { Nullish } from "lib/types";

import {
  Alert,
  AlertDescription,
  Flex,
  Spinner,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useEvmConfig, useMoveConfig } from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { DecodeMessage } from "lib/components/decode-message/cosmos-message";
import { CustomIcon } from "lib/components/icon";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

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
  const move = useMoveConfig({ shouldRedirect: false });

  const {
    decodedTx,
    logs,
    tx: {
      body: { messages },
    },
  } = txData;

  const [visibleCount, setVisibleCount] = useState(10);
  const { inView, ref } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && visibleCount < messages.length) {
      setVisibleCount((prev) => Math.min(prev + 10, messages.length));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

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
          {move.enabled && (
            <CustomTab onClick={() => setTab(MessageSectionTab.BalanceChange)}>
              Balance changes
            </CustomTab>
          )}
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <>
              {messages
                .slice(0, visibleCount)
                .map(
                  (msg, idx) =>
                    decodedTx.messages[idx] && (
                      <DecodeMessage
                        key={JSON.stringify(msg) + idx.toString()}
                        compact={false}
                        decodedMessage={decodedTx.messages[idx].decodedMessage}
                        log={logs[idx]}
                        metadata={decodedTx.metadata}
                        msgBody={msg}
                        msgCount={messages.length}
                      />
                    )
                )}
              {visibleCount < messages.length && (
                <Flex align="center" justify="center" mt={4} ref={ref}>
                  <Spinner />
                </Flex>
              )}
            </>
          </TabPanel>
          <TabPanel px={0}>
            <BalanceChanges
              metadata={decodedTx.metadata}
              totalBalanceChanges={decodedTx.totalBalanceChanges}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};
