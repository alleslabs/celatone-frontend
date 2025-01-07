import { Alert, AlertDescription, Flex } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import type { TxData, TxDataJsonRpc } from "lib/services/types";
import type { Option } from "lib/types";

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
}: EvmTxMsgDetailsProps) => (
  <Flex flex={1} gap={4} w="full" direction="column">
    {cosmosTxData.isTxFailed && (
      <Alert alignItems="center" mb={2} variant="error" overflow="unset">
        <Flex align="start" gap={2}>
          <CustomIcon
            name="alert-triangle-solid"
            boxSize={4}
            color="error.main"
          />
          <AlertDescription wordBreak="break-word">
            {cosmosTxData.rawLog}
          </AlertDescription>
        </Flex>
      </Alert>
    )}
    <EvmTxMsgDetailsBody evmTxData={evmTxData} evmDenom={evmDenom} />
    <EvmInputData inputData={evmTxData.tx.input} />
  </Flex>
);
