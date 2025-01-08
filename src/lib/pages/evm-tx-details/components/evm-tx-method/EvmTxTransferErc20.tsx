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
  formatTokenWithValue,
  getEvmToAddress,
  hexToBig,
  isSupportedToken,
} from "lib/utils";

import { EvmInfoLabelValue } from "./EvmInfoLabelValue";
import { EvmTxMethodAccordion } from "./EvmTxMethodAccordion";

interface EvmTxTransferErc20Props {
  assetInfos: Option<AssetInfos>;
  evmTxData: TxDataJsonRpc;
}

export const EvmTxTransferErc20 = ({
  assetInfos,
  evmTxData,
}: EvmTxTransferErc20Props) => {
  const { from, input, to: erc20Contract } = evmTxData.tx;

  const toAddress = getEvmToAddress(evmTxData);
  const amountBig = hexToBig(evmTxData.tx.input.slice(74, 138));

  const amount = coinToTokenWithValue(
    erc20Contract ? convertToEvmDenom(erc20Contract) : "",
    amountBig.toString(),
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
          <EvmMethodChip width="110px" txInput={input} />{" "}
          {formatTokenWithValue(amount)} to{" "}
          {toAddress?.address ? (
            <ExplorerLink
              textVariant="body1"
              type={toAddress.type}
              value={toAddress.address}
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
          toAddress ? (
            <ExplorerLink
              fixedHeight={false}
              type={toAddress.type}
              value={toAddress.address}
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
        label="ERC20 Contract"
        value={
          erc20Contract ? (
            <Flex align="center" gap={1}>
              <CustomIcon
                name="contract-address"
                boxSize={3}
                color="primary.main"
              />
              <ExplorerLink
                fixedHeight={false}
                type="evm_contract_address"
                value={erc20Contract}
                showCopyOnHover
                textFormat="normal"
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
