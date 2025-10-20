import type { Log } from "@cosmjs/stargate/build/logs";
import type { DecodedNotSupportedCall } from "@initia/tx-decoder";
import type { Option } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";

import { DecodeMessageBody } from "../decode-message-body";
import { DecodeMessageHeader } from "../decode-message-header";
import { DecodeMessageRow } from "../decode-message-row";

interface DecodeEvmMessageNotSupportedProps {
  compact: boolean;
  decodedTransaction: DecodedNotSupportedCall;
  log: Option<Log>;
  msgCount: number;
}

export const DecodeEvmMessageNotSupportedHeader = ({
  compact,
  decodedTransaction,
  msgCount,
}: DecodeEvmMessageNotSupportedProps) => {
  const {
    data: { from, input, to },
  } = decodedTransaction;

  return (
    <Flex direction="column" w="100%">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
        isExpand
        isIbc={false}
        isOpinit={false}
        isSingleMsg={msgCount === 1}
        label={input.slice(0, 10)}
        msgCount={msgCount}
        type={decodedTransaction.action}
      >
        {to && (
          <Flex align="center" gap={2}>
            <Text color="text.dark">on</Text>
            <ExplorerLink
              leftIcon={
                <CustomIcon
                  boxSize={4}
                  color="primary.main"
                  name="contract-address"
                />
              }
              showCopyOnHover
              type="evm_contract_address"
              value={to}
            />
          </Flex>
        )}
        <Flex align="center" gap={2}>
          <Text color="text.dark">by</Text>
          <ExplorerLink showCopyOnHover type="user_address" value={from} />
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
        <ExplorerLink showCopyOnHover type="user_address" value={from} />
      </DecodeMessageRow>
      {to && (
        <DecodeMessageRow title="To contract">
          <ExplorerLink
            leftIcon={
              <CustomIcon
                boxSize={4}
                color="primary.main"
                name="contract-address"
              />
            }
            showCopyOnHover
            type="evm_contract_address"
            value={to}
          />
        </DecodeMessageRow>
      )}
    </DecodeMessageBody>
  );
};
