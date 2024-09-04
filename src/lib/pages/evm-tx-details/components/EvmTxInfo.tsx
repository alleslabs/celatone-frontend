import type { FlexProps } from "@chakra-ui/react";
import { chakra, Divider, Flex } from "@chakra-ui/react";

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

interface EvmTxInfoProps extends FlexProps {
  evmTxData: TxDataJsonRpc;
  cosmosTxData: TxData;
  evmDenom: Option<string>;
}

const Container = chakra(Flex, {
  baseStyle: {
    flexDir: "column",
    gap: 6,
    w: "250px",
    minW: "180px",
  },
});

export const EvmTxInfo = ({
  evmTxData,
  cosmosTxData,
  evmDenom,
  ...flexProps
}: EvmTxInfoProps) => {
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
      <LabelText label="Network">{currentChainId}</LabelText>
      <LabelText label="Block Height">
        <ExplorerLink
          value={evmTxData.tx.blockNumber.toString()}
          type="block_height"
          showCopyOnHover
          ampCopierSection="tx_page_block_height"
        />
      </LabelText>
      <LabelText label="Cosmos Tx">
        <ExplorerLink
          value={cosmosTxData.txhash.toUpperCase()}
          type="tx_hash"
          showCopyOnHover
        />
      </LabelText>
      <LabelText label="Transaction Fee">
        {formatTokenWithValue(feeToken)}
      </LabelText>
      <Divider />
      <LabelText label="Gas Price">{formatTokenWithValue(gasPrice)}</LabelText>
      <LabelText label="Usage by Tx & Gas Limit">
        {`${formatInteger(evmTxData.txReceipt.gasUsed.toNumber())}/${formatInteger(evmTxData.tx.gas.toNumber())}`}
      </LabelText>
    </Container>
  );
};
