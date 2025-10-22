import type { Log } from "@cosmjs/stargate/build/logs";
import type { DecodedErc20ApproveCall } from "@initia/tx-decoder";
import type { EvmVerifyInfosResponse } from "lib/services/types";
import type { Nullable, Option } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { CoinsComponent } from "lib/components/tx-message/msg-receipts/CoinsComponent";

import { DecodeMessageBody } from "../decode-message-body";
import { DecodeMessageHeader } from "../decode-message-header";
import { DecodeMessageRow } from "../decode-message-row";

interface DecodeEvmMessageErc20ApproveProps {
  compact: boolean;
  decodedTransaction: DecodedErc20ApproveCall;
  evmVerifyInfos: Option<Nullable<EvmVerifyInfosResponse>>;
  log: Option<Log>;
  msgCount: number;
}

export const DecodeEvmMessageErc20ApproveHeader = ({
  compact,
  decodedTransaction,
  evmVerifyInfos,
  msgCount,
}: DecodeEvmMessageErc20ApproveProps) => {
  const { from, spender } = decodedTransaction.data;

  return (
    <Flex direction="column" w="100%">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
        isExpand
        isIbc={false}
        isOpinit={false}
        isSingleMsg={msgCount === 1}
        label="ERC20 approve"
        msgCount={msgCount}
        type={decodedTransaction.action}
      >
        <Text color="text.dark">by</Text>
        <ExplorerLink
          showCopyOnHover
          textLabel={evmVerifyInfos?.[from.toLowerCase()]?.contractName}
          type="user_address"
          value={from}
        />
        <Text color="text.dark">to</Text>
        <ExplorerLink
          showCopyOnHover
          textLabel={evmVerifyInfos?.[spender.toLowerCase()]?.contractName}
          type="user_address"
          value={spender}
        />
      </DecodeMessageHeader>
    </Flex>
  );
};

export const DecodeEvmMessageErc20ApproveBody = ({
  compact,
  decodedTransaction,
  evmVerifyInfos,
}: DecodeEvmMessageErc20ApproveProps) => {
  const { amount, contract, denom, from, spender } = decodedTransaction.data;

  return (
    <DecodeMessageBody
      compact={compact}
      isExpand
      log={undefined}
      sx={{
        pl: 0,
      }}
    >
      <DecodeMessageRow title="Sender">
        <ExplorerLink
          showCopyOnHover
          textFormat="normal"
          type="user_address"
          value={from}
        />
      </DecodeMessageRow>
      <DecodeMessageRow title="Receiver">
        <ExplorerLink
          showCopyOnHover
          textFormat="normal"
          type="user_address"
          value={spender}
        />
      </DecodeMessageRow>
      <DecodeMessageRow title="Amount">
        <CoinsComponent coins={[{ amount, denom }]} />
      </DecodeMessageRow>
      <DecodeMessageRow title="ERC-20 Contract">
        <ExplorerLink
          leftIcon={
            <CustomIcon
              boxSize={4}
              color="primary.main"
              name="contract-address"
            />
          }
          showCopyOnHover
          textFormat="normal"
          textLabel={evmVerifyInfos?.[contract.toLowerCase()]?.contractName}
          type="user_address"
          value={contract}
        />
      </DecodeMessageRow>
    </DecodeMessageBody>
  );
};
