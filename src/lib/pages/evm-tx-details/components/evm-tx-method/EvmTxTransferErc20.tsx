import type { TxDataJsonRpc } from "lib/services/types";
import type { AssetInfos, Option } from "lib/types";

import { Box, Spinner, Text } from "@chakra-ui/react";
import { EvmMethodChip } from "lib/components/EvmMethodChip";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { TokenCard, UnsupportedToken } from "lib/components/token";
import { useEvmVerifyInfos } from "lib/services/verification/evm";
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
  assetInfos: Option<AssetInfos>;
  evmTxData: TxDataJsonRpc;
}

export const EvmTxTransferErc20 = ({
  assetInfos,
  evmTxData,
}: EvmTxTransferErc20Props) => {
  const { from, input, to: erc20Contract } = evmTxData.tx;
  const { data: evmVerifyInfos, isLoading: isEvmVerifInfosLoading } =
    useEvmVerifyInfos(erc20Contract ? [erc20Contract] : []);
  const { address, amount } = extractErc20TransferInput(input);

  const amountToken = coinToTokenWithValue(
    erc20Contract ? convertToEvmDenom(erc20Contract) : "",
    amount.toString(),
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
          <EvmMethodChip txInput={input} txTo={erc20Contract} width="110px" />{" "}
          {formatTokenWithValue(amountToken)} to{" "}
          <ExplorerLink
            showCopyOnHover
            textVariant="body1"
            type="user_address"
            value={address}
          />
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
          <ExplorerLink
            fixedHeight={false}
            showCopyOnHover
            textFormat="normal"
            type="user_address"
            value={address}
          />
        }
      />
      <EvmInfoLabelValue
        label="ERC20 Contract"
        value={
          erc20Contract ? (
            <>
              {isEvmVerifInfosLoading ? (
                <Spinner boxSize={4} />
              ) : (
                <ExplorerLink
                  fixedHeight={false}
                  leftIcon={
                    <CustomIcon
                      boxSize={3}
                      color="primary.main"
                      name="contract-address"
                    />
                  }
                  showCopyOnHover
                  textFormat="normal"
                  textLabel={
                    evmVerifyInfos?.[erc20Contract.toLowerCase()]?.contractName
                  }
                  type="evm_contract_address"
                  value={erc20Contract}
                />
              )}
            </>
          ) : (
            <Text color="text.disabled" variant="body2">
              -
            </Text>
          )
        }
      />
      <EvmInfoLabelValue
        label="Transferred token"
        value={
          isSupportedToken(amountToken) ? (
            <TokenCard minW={{ base: "full", md: "50%" }} token={amountToken} />
          ) : (
            <UnsupportedToken
              minW={{ base: "full", md: "50%" }}
              token={amountToken}
            />
          )
        }
      />
    </EvmTxMethodAccordion>
  );
};
