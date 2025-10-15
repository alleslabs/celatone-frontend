import type {
  DecodedMessage,
  DecodedNotSupportedCall,
} from "@initia/tx-decoder";
import type { TxMsgData } from "lib/components/tx-message";

import { Flex, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";

import { DecodeMessageBody } from "../decode-message-body";
import { DecodeMessageHeader } from "../decode-message-header";
import { DecodeMessageRow } from "../decode-message-row";

interface DecodeEvmMessageNotSupportedProps extends TxMsgData {
  decodedMessage: DecodedMessage;
  decodedTransaction: DecodedNotSupportedCall;
}

export const DecodeEvmMessageNotSupportedHeader = ({
  compact,
  decodedMessage,
  decodedTransaction,
  msgBody,
  msgCount,
}: DecodeEvmMessageNotSupportedProps) => {
  const { isIbc, isOp } = decodedMessage;
  const {
    data: { from, input, to },
  } = decodedTransaction;

  return (
    <Flex direction="column" w="100%">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
        isExpand
        isIbc={isIbc}
        isOpinit={isOp}
        isSingleMsg={msgCount === 1}
        label={input.slice(0, 10)}
        msgCount={msgCount}
        type={msgBody["@type"]}
      >
        {to && (
          <Flex align="center" gap={2}>
            <Text color="text.dark">on</Text>
            <ExplorerLink
              leftIcon={
                <CustomIcon color="primary.main" name="contract-address" />
              }
              showCopyOnHover
              textVariant={compact ? "body2" : "body1"}
              type="evm_contract_address"
              value={to}
            />
          </Flex>
        )}
        <Flex align="center" gap={2}>
          <Text color="text.dark">by</Text>
          <ExplorerLink
            showCopyOnHover
            textVariant={compact ? "body2" : "body1"}
            type="evm_tx_hash"
            value={from}
          />
        </Flex>
      </DecodeMessageHeader>
    </Flex>
  );
};

export const DecodeEvmMessageNotSupportedBody = ({
  compact,
  decodedTransaction,
}: DecodeEvmMessageNotSupportedProps) => {
  const {
    data: { from, to },
  } = decodedTransaction;

  return (
    <DecodeMessageBody
      compact={compact}
      isExpand
      log={undefined}
      sx={{
        pl: 0,
      }}
    >
      <DecodeMessageRow title="From">
        <ExplorerLink
          showCopyOnHover
          textVariant={compact ? "body2" : "body1"}
          type="evm_tx_hash"
          value={from}
        />
      </DecodeMessageRow>
      {to && (
        <DecodeMessageRow title="To contract">
          <ExplorerLink
            leftIcon={
              <CustomIcon color="primary.main" name="contract-address" />
            }
            showCopyOnHover
            textVariant={compact ? "body2" : "body1"}
            type="evm_contract_address"
            value={to}
          />
        </DecodeMessageRow>
      )}
    </DecodeMessageBody>
  );
};
