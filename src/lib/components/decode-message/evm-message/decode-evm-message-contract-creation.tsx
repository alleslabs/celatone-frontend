import type { Log } from "@cosmjs/stargate/build/logs";
import type { DecodedContractCreationCall } from "@initia/tx-decoder";
import type { Option } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";

import { DecodeMessageBody } from "../decode-message-body";
import { DecodeMessageHeader } from "../decode-message-header";
import { DecodeMessageRow } from "../decode-message-row";

interface DecodeEvmMessageContractCreationProps {
  compact: boolean;
  decodedTransaction: DecodedContractCreationCall;
  log: Option<Log>;
  msgCount: number;
}

export const DecodeEvmMessageContractCreationHeader = ({
  compact,
  decodedTransaction,
  msgCount,
}: DecodeEvmMessageContractCreationProps) => {
  const { contractAddresses, from } = decodedTransaction.data;

  const contractCount = contractAddresses.length;
  const isSingleContract = contractCount === 1;

  return (
    <Flex direction="column" w="100%">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
        isExpand
        isIbc={false}
        isOpinit={false}
        isSingleMsg={msgCount === 1}
        label="Create contract"
        msgCount={msgCount}
        type={decodedTransaction.action}
      >
        {isSingleContract && contractAddresses.length > 0 && (
          <ExplorerLink
            leftIcon={
              <CustomIcon color="primary.main" name="contract-address" />
            }
            showCopyOnHover
            type="evm_contract_address"
            value={contractAddresses[0]}
          />
        )}
        {!isSingleContract && contractCount > 0 && (
          <Text color="text.main" fontWeight={600}>
            {contractCount} contracts
          </Text>
        )}
        <Text color="text.dark">by</Text>
        <ExplorerLink showCopyOnHover type="evm_tx_hash" value={from} />
      </DecodeMessageHeader>
    </Flex>
  );
};

export const DecodeEvmMessageContractCreationBody = ({
  compact,
  decodedTransaction,
}: DecodeEvmMessageContractCreationProps) => {
  const { contractAddresses, from } = decodedTransaction.data;

  const isSingleContract = contractAddresses.length === 1;

  return (
    <DecodeMessageBody
      compact={compact}
      isExpand
      log={undefined}
      sx={{
        pb: 1,
        pl: 0,
      }}
    >
      <DecodeMessageRow title="Creator">
        <ExplorerLink
          showCopyOnHover
          textFormat="normal"
          type="evm_tx_hash"
          value={from}
        />
      </DecodeMessageRow>
      {isSingleContract ? (
        <DecodeMessageRow title="Created Contract">
          <ExplorerLink
            leftIcon={
              <CustomIcon color="primary.main" name="contract-address" />
            }
            showCopyOnHover
            textFormat="normal"
            type="evm_contract_address"
            value={contractAddresses[0]}
          />
        </DecodeMessageRow>
      ) : (
        <DecodeMessageRow title="Created Contracts">
          <Flex direction="column" gap={2} w="full">
            {contractAddresses.map((address) => (
              <ExplorerLink
                key={address}
                leftIcon={
                  <CustomIcon color="primary.main" name="contract-address" />
                }
                showCopyOnHover
                textFormat="normal"
                type="evm_contract_address"
                value={address}
              />
            ))}
          </Flex>
        </DecodeMessageRow>
      )}
    </DecodeMessageBody>
  );
};
