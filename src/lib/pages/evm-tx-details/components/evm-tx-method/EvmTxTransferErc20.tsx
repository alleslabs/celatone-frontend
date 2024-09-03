import { Flex, Text } from "@chakra-ui/react";

import { EvmMethodChip } from "lib/components/EvmMethodChip";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TokenCard } from "lib/components/token";
import { useEvmDenomByAddressLcd } from "lib/services/evm";
import type { TxDataJsonRpc } from "lib/services/types";
import type { AssetInfos, HexAddr20, Option } from "lib/types";
import {
  coinToTokenWithValue,
  formatTokenWithValue,
  hexToBig,
} from "lib/utils";

import { EvmTxMethodAccordion } from "./EvmTxMethodAccordion";
import { InfoLabelValue } from "./InformationRow";

interface EvmTxTransferErc20Props {
  evmTxData: TxDataJsonRpc;
  assetInfos: Option<AssetInfos>;
}

export const EvmTxTransferErc20 = ({
  evmTxData,
  assetInfos,
}: EvmTxTransferErc20Props) => {
  const { from, input, to: erc20Contract } = evmTxData.tx;
  const { data: evmDenom } = useEvmDenomByAddressLcd(
    erc20Contract as HexAddr20
  );

  const to = `0x${evmTxData.tx.input.slice(34, 74)}`;
  const amountBig = hexToBig(evmTxData.tx.input.slice(74, 138));

  const amount = coinToTokenWithValue(
    evmDenom ?? "",
    amountBig.toString(),
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
          <EvmMethodChip txInput={input} width="110px" />{" "}
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
