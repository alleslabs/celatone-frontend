import type { Log } from "@cosmjs/stargate/build/logs";
import type { DecodedEthTransferCall } from "@initia/tx-decoder";
import type { Option } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TokenImageWithAmount } from "lib/components/token/TokenImageWithAmount";
import { useAssetInfos } from "lib/services/assetService";
import { coinToTokenWithValue } from "lib/utils";

import { DecodeMessageBody } from "../decode-message-body";
import { DecodeMessageHeader } from "../decode-message-header";
import { DecodeMessageRow } from "../decode-message-row";

interface DecodeEvmMessageEthTransferProps {
  compact: boolean;
  decodedTransaction: DecodedEthTransferCall;
  log: Option<Log>;
  msgCount: number;
}

export const DecodeEvmMessageEthTransferHeader = ({
  compact,
  decodedTransaction,
  msgCount,
}: DecodeEvmMessageEthTransferProps) => {
  const { amount, from, to } = decodedTransaction.data;
  const { data: assetInfos } = useAssetInfos({ withPrices: false });

  // TODO: Confirm is it always this address for ETH transfers
  const token = coinToTokenWithValue(
    "E1Ff7038eAAAF027031688E1535a055B2Bac2546",
    amount,
    assetInfos
  );

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
        <ExplorerLink showCopyOnHover type="evm_tx_hash" value={from} />
        <Text color="text.dark">to</Text>
        <ExplorerLink showCopyOnHover type="evm_tx_hash" value={to} />
      </DecodeMessageHeader>
    </Flex>
  );
};

export const DecodeEvmMessageEthTransferBody = ({
  compact,
  decodedTransaction,
}: DecodeEvmMessageEthTransferProps) => {
  const { amount, from, to } = decodedTransaction.data;
  const { data: assetInfos } = useAssetInfos({ withPrices: false });

  // ETH transfers don't have a denom field - they're always native ETH
  const token = coinToTokenWithValue("ETH", amount, assetInfos);

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
          value={from}
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
    </DecodeMessageBody>
  );
};
