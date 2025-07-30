import type { TxData, TxDataJsonRpc } from "lib/services/types";
import type { Option } from "lib/types";

import {
  Alert,
  AlertDescription,
  Flex,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { CustomTab } from "lib/components/CustomTab";
import { DividerWithArrow } from "lib/components/DividerWithArrow";
import { CustomIcon } from "lib/components/icon";
import { useEvmVerifyInfos } from "lib/services/verification/evm";
import plur from "plur";

import { EvmEventBox } from "./evm-event-box";
import { EvmInputData } from "./EvmInputData";
import { EvmTxMsgDetailsBody } from "./EvmTxMsgDetailsBody";

interface EvmTxMsgDetailsProps {
  cosmosTxData: TxData;
  evmDenom: Option<string>;
  evmTxData: TxDataJsonRpc;
}

export const EvmTxMsgDetails = ({
  cosmosTxData,
  evmDenom,
  evmTxData,
}: EvmTxMsgDetailsProps) => {
  const { data } = useEvmVerifyInfos(
    evmTxData.txReceipt.logs.map((log) => log.address)
  );

  return (
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
        <TabPanel>
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
            <EvmTxMsgDetailsBody evmDenom={evmDenom} evmTxData={evmTxData} />
            <EvmInputData txInput={evmTxData.tx.input} txTo={evmTxData.tx.to} />
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
        <TabPanel>Internal txs</TabPanel>
        <TabPanel>Balance changes</TabPanel>
      </TabPanels>
    </Tabs>
  );
};
