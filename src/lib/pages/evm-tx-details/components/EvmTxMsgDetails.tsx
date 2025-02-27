import { Alert, AlertDescription, Flex } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import type { TxData, TxDataJsonRpc } from "lib/services/types";
import type { Option } from "lib/types";

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
  </Flex>
);
