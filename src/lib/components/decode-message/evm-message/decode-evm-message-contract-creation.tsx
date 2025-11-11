import type { Log } from "@cosmjs/stargate/build/logs";
import type { DecodedContractCreationCall } from "@initia/tx-decoder";
import type { EvmVerifyInfosResponse } from "lib/services/types";
import type { Nullable, Option } from "lib/types";

import { Flex, Tag, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import plur from "plur";

import { DecodeMessageBody } from "../decode-message-body";
import { DecodeMessageHeader } from "../decode-message-header";
import { DecodeMessageRow } from "../decode-message-row";

interface DecodeEvmMessageContractCreationProps {
  compact: boolean;
  decodedTransaction: DecodedContractCreationCall;
  evmVerifyInfos: Option<Nullable<EvmVerifyInfosResponse>>;
  log: Option<Log>;
  msgCount: number;
}

export const DecodeEvmMessageContractCreationHeader = ({
  compact,
  decodedTransaction,
  evmVerifyInfos,
  msgCount,
}: DecodeEvmMessageContractCreationProps) => {
  const { contractAddresses, from } = decodedTransaction.data;

  const contractCount = contractAddresses.length;

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
        {contractCount === 1 ? (
          <ExplorerLink
            leftIcon={
              <CustomIcon
                boxSize={4}
                color="primary.main"
                name="contract-address"
              />
            }
            showCopyOnHover
            textLabel={
              evmVerifyInfos?.[contractAddresses[0].toLowerCase()]?.contractName
            }
            type="user_address"
            value={contractAddresses[0]}
          />
        ) : (
          <>
            <Tag gap={0.5} minWidth="auto" py={0} variant="gray">
              <Text variant="body2" whiteSpace="nowrap">
                {contractCount}
              </Text>
            </Tag>
            <Text color="text.main">{plur("contract", contractCount)}</Text>
          </>
        )}
        <Text color="text.dark">by</Text>
        <ExplorerLink showCopyOnHover type="user_address" value={from} />
      </DecodeMessageHeader>
    </Flex>
  );
};

export const DecodeEvmMessageContractCreationBody = ({
  compact,
  decodedTransaction,
  evmVerifyInfos,
}: DecodeEvmMessageContractCreationProps) => {
  const { contractAddresses, from } = decodedTransaction.data;

  const contractCount = contractAddresses.length;

  return (
    <DecodeMessageBody
      compact={compact}
      isExpand
      log={undefined}
      sx={{
        pl: 0,
      }}
    >
      <DecodeMessageRow title="Creator">
        <ExplorerLink
          showCopyOnHover
          textFormat="normal"
          type="user_address"
          value={from}
        />
      </DecodeMessageRow>
      <DecodeMessageRow title={`Created ${plur("Contract", contractCount)}`}>
        <Flex direction="column" gap={1} w="full">
          {contractAddresses.map((address) => (
            <ExplorerLink
              key={address}
              leftIcon={
                <CustomIcon
                  boxSize={4}
                  color="primary.main"
                  name="contract-address"
                />
              }
              showCopyOnHover
              textFormat="normal"
              textLabel={evmVerifyInfos?.[address.toLowerCase()]?.contractName}
              type="user_address"
              value={address}
            />
          ))}
        </Flex>
      </DecodeMessageRow>
    </DecodeMessageBody>
  );
};
