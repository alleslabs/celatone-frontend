import { Box, Flex, Text } from "@chakra-ui/react";

import { EvmMethodChip } from "lib/components/EvmMethodChip";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { TokenCard, UnsupportedToken } from "lib/components/token";
import type { TxDataJsonRpc } from "lib/services/types";
import type { AssetInfos, Option } from "lib/types";
import {
  coinToTokenWithValue,
  convertToEvmDenom,
  extractErc20TransferInput,
  formatTokenWithValue,
  isSupportedToken,
} from "lib/utils";

import { EvmInfoLabelValue } from "./EvmInfoLabelValue";
import { EvmTxMethodAccordion } from "./EvmTxMethodAccordion";

interface EvmTxTransferErc20Props {
  evmTxData: TxDataJsonRpc;
  assetInfos: Option<AssetInfos>;
}

export const EvmTxTransferErc20 = ({
  evmTxData,
  assetInfos,
}: EvmTxTransferErc20Props) => {
  const { from, input, to: erc20Contract } = evmTxData.tx;

  const { address, amount } = extractErc20TransferInput(input);

  const amountToken = coinToTokenWithValue(
    erc20Contract ? convertToEvmDenom(erc20Contract) : "",
    amount.toString(),
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
          <EvmMethodChip txInput={input} txTo={erc20Contract} width="110px" />{" "}
          {formatTokenWithValue(amountToken)} to{" "}
          <ExplorerLink
            type="user_address"
            value={address}
            showCopyOnHover
            textVariant="body1"
          />
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
          <ExplorerLink
            type="user_address"
            value={address}
            showCopyOnHover
            textFormat="normal"
            fixedHeight={false}
          />
        }
      />
      <EvmInfoLabelValue
        label="ERC20 Contract"
        value={
          erc20Contract ? (
            <Flex gap={1} align="center">
              <CustomIcon
                name="contract-address"
                boxSize={3}
                color="primary.main"
              />
              <ExplorerLink
                value={erc20Contract}
                type="evm_contract_address"
                showCopyOnHover
                textFormat="normal"
                fixedHeight={false}
              />
            </Flex>
          ) : (
            <Text variant="body2" color="text.disabled">
              -
            </Text>
          )
        }
      />
      <EvmInfoLabelValue
        label="Transferred token"
        value={
          isSupportedToken(amountToken) ? (
            <TokenCard token={amountToken} minW={{ base: "full", md: "50%" }} />
          ) : (
            <UnsupportedToken
              token={amountToken}
              minW={{ base: "full", md: "50%" }}
            />
          )
        }
      />
    </EvmTxMethodAccordion>
  );
};
