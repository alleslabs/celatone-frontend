import type { TxDataJsonRpc } from "lib/services/types";
import type { AssetInfos, Option } from "lib/types";

import { Box, Text } from "@chakra-ui/react";
import { EvmMethodChip } from "lib/components/EvmMethodChip";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TokenCard, UnsupportedToken } from "lib/components/token";
import {
  coinToTokenWithValue,
  formatTokenWithValue,
  isSupportedToken,
} from "lib/utils";

import { EvmInfoLabelValue } from "./EvmInfoLabelValue";
import { EvmTxMethodAccordion } from "./EvmTxMethodAccordion";

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
      content={
        <Box display="inline">
          <ExplorerLink
            ampCopierSection="tx_page_message_header_send_address"
            showCopyOnHover
            textVariant="body1"
            type="user_address"
            value={from}
          />{" "}
          <EvmMethodChip txInput={input} txTo={to} width="65px" />{" "}
          {formatTokenWithValue(amount)} to{" "}
          {to ? (
            <ExplorerLink
              showCopyOnHover
              textVariant="body1"
              type="user_address"
              value={to}
            />
          ) : (
            <Text color="text.disabled" variant="body2">
              -
            </Text>
          )}
        </Box>
      }
      msgIcon="send"
    >
      <EvmInfoLabelValue
        label="From"
        value={
          <ExplorerLink
            fixedHeight={false}
            showCopyOnHover
            textFormat="normal"
            type="user_address"
            value={from}
          />
        }
      />
      <EvmInfoLabelValue
        label="To"
        value={
          to ? (
            <ExplorerLink
              fixedHeight={false}
              showCopyOnHover
              textFormat="normal"
              type="user_address"
              value={to}
            />
          ) : (
            <Text color="text.disabled" variant="body2">
              -
            </Text>
          )
        }
      />
      <EvmInfoLabelValue
        label="Transferred Token"
        value={
          isSupportedToken(amount) ? (
            <TokenCard minW={{ base: "full", md: "50%" }} token={amount} />
          ) : (
            <UnsupportedToken
              minW={{ base: "full", md: "50%" }}
              token={amount}
            />
          )
        }
      />
    </EvmTxMethodAccordion>
  );
};
