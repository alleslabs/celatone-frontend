import {
  Alert,
  AlertDescription,
  Box,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";

import { CopyButton } from "lib/components/copy";
import { CustomIcon } from "lib/components/icon";
import type { TxData, TxDataJsonRpc } from "lib/services/types";

import { EvmTxDetailBody } from "./EvmTxDetailBody";

interface EvmTxDetailProps {
  evmTxData: TxDataJsonRpc;
  cosmosTxData: TxData;
}

export const EvmTxDetail = ({ evmTxData, cosmosTxData }: EvmTxDetailProps) => {
  return (
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
      <EvmTxDetailBody evmTxData={evmTxData} />
      <Heading as="h6" variant="h6">
        Input Data
      </Heading>
      {/* TODO: Can't find border color in theme */}
      <Box
        borderRadius="8px"
        minHeight="100px"
        py={4}
        px={3}
        border="1px solid #343445"
        position="relative"
        transition="all 0.25s ease-in-out"
        _hover={{
          borderColor: "gray.600",
          "& .copy-button-box": { display: "block" },
        }}
      >
        <Text wordBreak="break-all">{evmTxData.tx.input}</Text>
        <Box
          position="absolute"
          top="10px"
          right="10px"
          className="copy-button-box"
          display="none"
          borderRadius="8px"
          backgroundColor="gray.800"
        >
          <CopyButton value={evmTxData.tx.input} />
        </Box>
      </Box>
    </Flex>
  );
};
