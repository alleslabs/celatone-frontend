import type {
  TxData,
  TxDataJsonRpcWithDecodedEthereumTx,
} from "lib/services/types";

import {
  Alert,
  AlertDescription,
  Flex,
  Stack,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { CustomTab } from "lib/components/CustomTab";
import {
  DecodeCosmosEvmMessageBody,
  DecodeCosmosEvmMessageHeader,
} from "lib/components/decode-message/evm-message";
import { DividerWithArrow } from "lib/components/DividerWithArrow";
import { EvmInputData } from "lib/components/EvmInputData";
import { CustomIcon } from "lib/components/icon";
import { EmptyState } from "lib/components/state";
import { EvmInternalTransactionsTable } from "lib/components/table/evm-internal-transactions";
import { useEvmInternalTxsByTxHashSequencer } from "lib/services/evm-internal-txs";
import { useEvmVerifyInfos } from "lib/services/verification/evm";
import { type HexAddr20, type Option, zHexAddr } from "lib/types";
import plur from "plur";
import { useMemo } from "react";

import { EvmEventBox } from "./evm-event-box";
// import { EvmTxMsgDetailsBody } from "./EvmTxMsgDetailsBody";

interface EvmTxMsgDetailsProps {
  cosmosTxData: TxData;
  evmDenom: Option<string>;
  evmTxData: TxDataJsonRpcWithDecodedEthereumTx;
}

export const EvmTxMsgDetails = ({
  cosmosTxData,
  evmDenom,
  evmTxData,
}: EvmTxMsgDetailsProps) => {
  void evmDenom;
  const { data } = useEvmVerifyInfos(
    [
      ...evmTxData.txReceipt.logs.map((log) => log.address),
      evmTxData.tx.to,
    ].filter((addr): addr is HexAddr20 => addr !== null)
  );
  const addressValidation = useMemo(
    () => zHexAddr.safeParse(evmTxData.txReceipt.transactionHash),
    [evmTxData.txReceipt.transactionHash]
  );
  const evmInternalTxsData = useEvmInternalTxsByTxHashSequencer(
    addressValidation.data,
    10,
    addressValidation.success
  );

  const countTotalEvmInternalTxs =
    evmInternalTxsData.data?.pages?.[0]?.pagination?.total ?? undefined;

  const {
    decodedTx,
    logs,
    tx: {
      body: { messages },
    },
  } = cosmosTxData;

  const { decodedTx: evmDecodedTx } = evmTxData;

  return (
    <Stack gap={6} w="full">
      {messages.map(
        (msg, idx) =>
          decodedTx.messages[idx] && (
            <DecodeCosmosEvmMessageHeader
              key={JSON.stringify(msg) + idx.toString()}
              compact={false}
              decodedMessage={decodedTx.messages[idx].decodedMessage}
              evmDecodedMessage={evmDecodedTx}
              log={logs[idx]}
              msgBody={msg}
              msgCount={messages.length}
            />
          )
      )}
      <Tabs isLazy lazyBehavior="keepMounted" w="full">
        <TabList
          id="cosmos-evm-txs-tab-list"
          borderBottomWidth="1px"
          borderColor="gray.700"
          overflowX="scroll"
        >
          <CustomTab>Overview</CustomTab>
          <CustomTab>Internal txs</CustomTab>
          <CustomTab>Balance changes</CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel pt={8}>
            <Flex direction="column" flex={1} gap={4} w="full">
              {cosmosTxData.isTxFailed && (
                <Alert
                  alignItems="center"
                  mb={2}
                  overflow="unset"
                  variant="error"
                >
                  <Flex align="start" gap={2}>
                    <CustomIcon
                      boxSize={4}
                      color="error.main"
                      name="alert-triangle-solid"
                    />
                    <AlertDescription wordBreak="break-word">
                      {cosmosTxData.rawLog}
                    </AlertDescription>
                  </Flex>
                </Alert>
              )}
              {messages.map(
                (msg, idx) =>
                  decodedTx.messages[idx] && (
                    <DecodeCosmosEvmMessageBody
                      key={JSON.stringify(msg) + idx.toString()}
                      compact={false}
                      decodedMessage={decodedTx.messages[idx].decodedMessage}
                      evmDecodedMessage={evmDecodedTx}
                      log={logs[idx]}
                      msgBody={msg}
                      msgCount={messages.length}
                    />
                  )
              )}
              <EvmInputData
                evmVerifyInfo={
                  data?.[evmTxData.tx.to?.toLowerCase() ?? ""] ?? null
                }
                txInput={evmTxData.tx.input}
              />
              {!!evmTxData.txReceipt.logs.length && (
                <>
                  <DividerWithArrow />
                  <Text color="text.dark" fontWeight={500} variant="body2">
                    {plur("Event log", evmTxData.txReceipt.logs.length)}
                  </Text>
                  <Flex direction="column" gap={3} w="full">
                    {evmTxData.txReceipt.logs.map((log) => (
                      <EvmEventBox
                        key={log.logIndex.toString()}
                        evmVerifyInfo={data?.[log.address] ?? null}
                        log={log}
                      />
                    ))}
                  </Flex>
                </>
              )}
            </Flex>
          </TabPanel>
          <TabPanel>
            <EvmInternalTransactionsTable
              emptyState={
                <EmptyState
                  imageVariant="empty"
                  message="There are no EVM transactions."
                />
              }
              fetchNextPage={evmInternalTxsData.fetchNextPage}
              internalTxs={
                evmInternalTxsData.data?.pages?.flatMap(
                  (page) => page.internalTxs
                ) ?? []
              }
              isFetchingNextPage={evmInternalTxsData.isFetchingNextPage}
              showParentHash={false}
              totalCount={countTotalEvmInternalTxs ?? 0}
            />
          </TabPanel>
          <TabPanel>Balance changes</TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
};
