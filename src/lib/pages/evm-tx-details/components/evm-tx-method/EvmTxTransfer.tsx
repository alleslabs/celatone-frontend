import { Flex, Text } from "@chakra-ui/react";

import { EvmMethodChip } from "lib/components/EvmMethodChip";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TokenCard } from "lib/components/token";
import type { TxDataJsonRpc } from "lib/services/types";
import type { AssetInfos, Option } from "lib/types";
import { coinToTokenWithValue, formatTokenWithValue } from "lib/utils";

import { EvmTxMethodAccordion } from "./EvmTxMethodAccordion";
import { InfoLabelValue } from "./InformationRow";

interface EvmTxTransferProps {
  evmTxData: TxDataJsonRpc;
  evmDenom: Option<string>;
  assetInfos: Option<AssetInfos>;
}

export const EvmTxTransfer = ({
  evmTxData,
  evmDenom,
  assetInfos,
}: EvmTxTransferProps) => {
  const { from, to, input } = evmTxData.tx;

  const amount = coinToTokenWithValue(
    evmDenom ?? "",
    evmTxData.tx.value.toString(),
    assetInfos
  );

  return (
    <EvmTxMethodAccordion
      msgIcon="send"
      content={
        <Flex gap={1} display="inline">
          <ExplorerLink
            type="user_address"
            value={from}
            showCopyOnHover
            textVariant="body1"
            ampCopierSection="tx_page_message_header_send_address"
          />{" "}
          <EvmMethodChip txInput={input} width="65px" />{" "}
          {formatTokenWithValue(amount)} to{" "}
          {to ? (
            <ExplorerLink
              type="user_address"
              value={to}
              showCopyOnHover
              textVariant="body1"
            />
          ) : (
            <Text>-</Text>
          )}
        </Flex>
      }
    >
      <InfoLabelValue
        label="From"
        value={
          <ExplorerLink type="user_address" value={from} showCopyOnHover />
        }
      />
      <InfoLabelValue
        label="To"
        value={
          to ? (
            <ExplorerLink type="user_address" value={to} showCopyOnHover />
          ) : (
            <Text>-</Text>
          )
        }
      />
      <InfoLabelValue
        label="Transferred Token"
        value={<TokenCard token={amount} />}
      />
    </EvmTxMethodAccordion>
  );
};
