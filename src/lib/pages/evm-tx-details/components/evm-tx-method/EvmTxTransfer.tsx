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
  assetInfos: Option<AssetInfos>;
  evmDenom: Option<string>;
  evmTxData: TxDataJsonRpc;
}

export const EvmTxTransfer = ({
  assetInfos,
  evmDenom,
  evmTxData,
}: EvmTxTransferProps) => {
  const { from, input, to } = evmTxData.tx;

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
            textVariant="body1"
            type="user_address"
            value={from}
            ampCopierSection="tx_page_message_header_send_address"
            showCopyOnHover
          />{" "}
          <EvmMethodChip width="65px" txInput={input} />{" "}
          {formatTokenWithValue(amount)} to{" "}
          {to ? (
            <ExplorerLink
              textVariant="body1"
              type="user_address"
              value={to}
              showCopyOnHover
            />
          ) : (
            <Text variant="body2" color="text.disabled">
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
            type="user_address"
            value={from}
            showCopyOnHover
            textFormat="normal"
          />
        }
      />
      <EvmInfoLabelValue
        label="To"
        value={
          to ? (
            <ExplorerLink
              fixedHeight={false}
              type="user_address"
              value={to}
              showCopyOnHover
              textFormat="normal"
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
