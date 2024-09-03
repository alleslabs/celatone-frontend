import { Alert, AlertDescription, Flex, Heading } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import { TextReadOnly } from "lib/components/json/TextReadOnly";
import type { TxData, TxDataJsonRpc } from "lib/services/types";
import type { Option } from "lib/types";

import { EvmTxDetailBody } from "./EvmTxDetailBody";

interface EvmTxDetailProps {
  evmTxData: TxDataJsonRpc;
  cosmosTxData: TxData;
  evmDenom: Option<string>;
}

export const EvmTxDetail = ({
  evmTxData,
  cosmosTxData,
  evmDenom,
}: EvmTxDetailProps) => (
  <Flex direction="column" flex={1} gap={4} w="full">
    {cosmosTxData.isTxFailed && (
      <Alert variant="error" mb={2} alignItems="center">
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
    <EvmTxDetailBody evmTxData={evmTxData} evmDenom={evmDenom} />
    <Heading as="h6" variant="h6">
      Input Data
    </Heading>
    <TextReadOnly text={evmTxData.tx.input} canCopy />
  </Flex>
);
