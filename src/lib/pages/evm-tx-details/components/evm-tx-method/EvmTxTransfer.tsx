import { Box, Text } from "@chakra-ui/react";

import { EvmMethodChip } from "lib/components/EvmMethodChip";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TokenCard, UnsupportedToken } from "lib/components/token";
import type { TxDataJsonRpc } from "lib/services/types";
import type { AssetInfos, Option } from "lib/types";
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
      msgIcon="send"
      content={
        <Box display="inline">
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
            <Text variant="body2" color="text.disabled">
              -
            </Text>
          )}
        </Box>
      }
    >
      <EvmInfoLabelValue
        label="From"
        value={
          <ExplorerLink
            type="user_address"
            value={from}
            showCopyOnHover
            textFormat="normal"
            fixedHeight={false}
          />
        }
      />
      <EvmInfoLabelValue
        label="To"
        value={
          to ? (
            <ExplorerLink
              type="user_address"
              value={to}
              showCopyOnHover
              textFormat="normal"
              fixedHeight={false}
            />
          ) : (
            <Text variant="body2" color="text.disabled">
              -
            </Text>
          )
        }
      />
      <EvmInfoLabelValue
        label="Transferred Token"
        value={
          isSupportedToken(amount) ? (
            <TokenCard token={amount} minW={{ base: "full", md: "50%" }} />
          ) : (
            <UnsupportedToken token={amount} />
          )
        }
      />
    </EvmTxMethodAccordion>
  );
};
