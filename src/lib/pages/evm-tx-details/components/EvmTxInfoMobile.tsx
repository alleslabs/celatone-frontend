import type { FlexProps } from "@chakra-ui/react";
import { chakra, Flex } from "@chakra-ui/react";

import { useCelatoneApp } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { useAssetInfos } from "lib/services/assetService";
import type { TxData, TxDataJsonRpc } from "lib/services/types";
import type { Option } from "lib/types";
import {
  coinToTokenWithValue,
  formatInteger,
  formatTokenWithValue,
} from "lib/utils";

interface EvmTxInfoMobileProps extends FlexProps {
  evmTxData: TxDataJsonRpc;
  cosmosTxData: TxData;
  evmDenom: Option<string>;
}

const Container = chakra(Flex, {
  baseStyle: {
    flexDir: "column",
    background: "gray.900",
    borderRadius: 2,
    padding: 3,
    gap: 6,
    marginY: 6,
  },
});

export const EvmTxInfoMobile = ({
  evmTxData,
  cosmosTxData,
  evmDenom,
  ...flexProps
}: EvmTxInfoMobileProps) => {
  const { currentChainId } = useCelatoneApp();
  const { data: assetInfos } = useAssetInfos({
    withPrices: true,
  });

  const feeToken = coinToTokenWithValue(
    evmDenom ?? "",
    evmTxData.txReceipt.gasUsed
      .mul(evmTxData.txReceipt.effectiveGasPrice)
      .toString(),
    assetInfos
  );

  const gasPrice = coinToTokenWithValue(
    evmDenom ?? "",
    evmTxData.txReceipt.effectiveGasPrice.toString(),
    assetInfos
  );

  // TODO: support tx type id 2 (EIP-1559) later
  return (
    <Container {...flexProps}>
      <Flex>
        <LabelText flex={1} label="Network">
          {currentChainId}
        </LabelText>
        <LabelText flex={1} label="Block">
          <ExplorerLink
            value={evmTxData.tx.blockNumber.toString()}
            type="block_height"
            showCopyOnHover
            ampCopierSection="tx_page_block_height"
          />
        </LabelText>
      </Flex>
      <LabelText flex={1} label="Transaction Fee">
        {formatTokenWithValue(feeToken)}
      </LabelText>
      <LabelText flex={1} label="Gas Price">
        {formatTokenWithValue(gasPrice)}
      </LabelText>
      <LabelText flex={1} label="Usage by Tx & Gas Limit">
        {`${formatInteger(evmTxData.txReceipt.gasUsed.toNumber())}/${formatInteger(evmTxData.tx.gas.toNumber())}`}
      </LabelText>
    </Container>
  );
};
