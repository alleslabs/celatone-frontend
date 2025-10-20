import type { Log } from "@cosmjs/stargate/build/logs";
import type { DecodedErc20TransferFromCall } from "@initia/tx-decoder";
import type { Option } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { TokenImageWithAmount } from "lib/components/token/TokenImageWithAmount";
import { useAssetInfos } from "lib/services/assetService";
import { coinToTokenWithValue } from "lib/utils";

import { DecodeMessageBody } from "../decode-message-body";
import { DecodeMessageHeader } from "../decode-message-header";
import { DecodeMessageRow } from "../decode-message-row";

interface DecodeEvmMessageErc20TransferFromProps {
  compact: boolean;
  decodedTransaction: DecodedErc20TransferFromCall;
  log: Option<Log>;
  msgCount: number;
}

export const DecodeEvmMessageErc20TransferFromHeader = ({
  compact,
  decodedTransaction,
  msgCount,
}: DecodeEvmMessageErc20TransferFromProps) => {
  const { amount, denom, owner, to } = decodedTransaction.data;
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
        <Text color="text.dark">from</Text>
        <ExplorerLink showCopyOnHover type="evm_tx_hash" value={owner} />
        <Text color="text.dark">to</Text>
        <ExplorerLink showCopyOnHover type="evm_tx_hash" value={to} />
      </DecodeMessageHeader>
    </Flex>
  );
};

export const DecodeEvmMessageErc20TransferFromBody = ({
  compact,
  decodedTransaction,
}: DecodeEvmMessageErc20TransferFromProps) => {
  const { amount, contract, denom, owner, to } = decodedTransaction.data;
  const { data: assetInfos } = useAssetInfos({ withPrices: false });

  const token = coinToTokenWithValue(denom, amount, assetInfos);

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
      <DecodeMessageRow title="Sender">
        <ExplorerLink
          showCopyOnHover
          textFormat="normal"
          type="evm_tx_hash"
          value={owner}
        />
      </DecodeMessageRow>
      <DecodeMessageRow title="Receiver">
        <ExplorerLink
          showCopyOnHover
          textFormat="normal"
          type="evm_tx_hash"
          value={to}
        />
      </DecodeMessageRow>
      <DecodeMessageRow title="Amount">
        <TokenImageWithAmount token={token} />
      </DecodeMessageRow>
      <DecodeMessageRow title="ERC-20 Contract">
        <ExplorerLink
          leftIcon={<CustomIcon color="primary.main" name="contract-address" />}
          showCopyOnHover
          textFormat="normal"
          type="evm_contract_address"
          value={contract}
        />
      </DecodeMessageRow>
    </DecodeMessageBody>
  );
};
