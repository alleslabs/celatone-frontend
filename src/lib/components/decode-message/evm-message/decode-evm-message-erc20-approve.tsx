import type { Log } from "@cosmjs/stargate/build/logs";
import type { DecodedErc20ApproveCall } from "@initia/tx-decoder";
import type { Option } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { TokenImageWithAmount } from "lib/components/token/TokenImageWithAmount";
import { CoinsComponent } from "lib/components/tx-message/msg-receipts/CoinsComponent";
import { useAssetInfos } from "lib/services/assetService";
import { coinToTokenWithValue } from "lib/utils";

import { DecodeMessageBody } from "../decode-message-body";
import { DecodeMessageHeader } from "../decode-message-header";
import { DecodeMessageRow } from "../decode-message-row";

interface DecodeEvmMessageErc20ApproveProps {
  compact: boolean;
  decodedTransaction: DecodedErc20ApproveCall;
  log: Option<Log>;
  msgCount: number;
}

export const DecodeEvmMessageErc20ApproveHeader = ({
  compact,
  decodedTransaction,
  msgCount,
}: DecodeEvmMessageErc20ApproveProps) => {
  const { amount, denom, from, spender } = decodedTransaction.data;
  const { data: assetInfos } = useAssetInfos({ withPrices: false });

  const token = coinToTokenWithValue(denom, amount, assetInfos);

  return (
    <Flex direction="column" w="100%">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
        isExpand
        isIbc={false}
        isOpinit={false}
        isSingleMsg={msgCount === 1}
        label="Transfer"
        msgCount={msgCount}
        type={decodedTransaction.action}
      >
        <Flex align="center" flexWrap="nowrap" gap={2} minWidth="fit-content">
          <TokenImageWithAmount token={token} />
        </Flex>
        <Text color="text.dark">by</Text>
        <ExplorerLink showCopyOnHover type="user_address" value={from} />
        <Text color="text.dark">to</Text>
        <ExplorerLink showCopyOnHover type="user_address" value={spender} />
      </DecodeMessageHeader>
    </Flex>
  );
};

export const DecodeEvmMessageErc20ApproveBody = ({
  compact,
  decodedTransaction,
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
          type="evm_contract_address"
          value={contract}
        />
      </DecodeMessageRow>
    </DecodeMessageBody>
  );
};
