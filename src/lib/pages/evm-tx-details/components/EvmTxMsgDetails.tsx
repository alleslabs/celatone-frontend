import { Alert, AlertDescription, Flex, Text } from "@chakra-ui/react";

import plur from "plur";
import { DividerWithArrow } from "lib/components/DividerWithArrow";
import { CustomIcon } from "lib/components/icon";
import type { TxData, TxDataJsonRpc } from "lib/services/types";
import type { Option } from "lib/types";

import { EvmEventBox } from "./EvmEventBox";
import { EvmInputData } from "./EvmInputData";
import { EvmTxMsgDetailsBody } from "./EvmTxMsgDetailsBody";

interface EvmTxMsgDetailsProps {
  evmTxData: TxDataJsonRpc;
  cosmosTxData: TxData;
  evmDenom: Option<string>;
}

export const EvmTxMsgDetails = ({
  evmTxData,
  cosmosTxData,
  evmDenom,
}: EvmTxMsgDetailsProps) => (
  <Flex direction="column" flex={1} gap={4} w="full">
    {cosmosTxData.isTxFailed && (
      <Alert variant="error" mb={2} alignItems="center" overflow="unset">
        <Flex gap={2} align="start">
          <CustomIcon
            name="alert-triangle-solid"
            color="error.main"
            boxSize={4}
          />
          <AlertDescription wordBreak="break-word">
            {cosmosTxData.rawLog}
          </AlertDescription>
        </Flex>
      </Alert>
    )}
    <EvmTxMsgDetailsBody evmTxData={evmTxData} evmDenom={evmDenom} />
    <EvmInputData txInput={evmTxData.tx.input} txTo={evmTxData.tx.to} />
    {evmTxData.txReceipt.logs && (
      <>
        <DividerWithArrow />
        <Text variant="body2" fontWeight={500} color="text.dark">
          {plur("Event Log", evmTxData.txReceipt.logs.length)}
        </Text>
        <Flex direction="column" gap={3} w="full">
          {evmTxData.txReceipt.logs.map((log) => (
            <EvmEventBox
              key={log.logIndex.toString()}
              // log={log}
              // msgIndex={idx}
            />
          ))}
        </Flex>
      </>
    )}
  </Flex>
);
