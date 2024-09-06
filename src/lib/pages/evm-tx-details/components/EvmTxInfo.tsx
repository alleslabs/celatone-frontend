import type { FlexProps } from "@chakra-ui/react";
import { chakra, Flex } from "@chakra-ui/react";

import type { GasInfo } from "../data";
import { useCelatoneApp } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import type { TxData, TxDataJsonRpc } from "lib/services/types";
import { formatTokenWithValue } from "lib/utils";

import { EvmTxGasReceipt } from "./EvmTxGasReceipt";

interface EvmTxInfoProps extends FlexProps {
  evmTxData: TxDataJsonRpc;
  cosmosTxData: TxData;
  gasInfo: GasInfo;
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
  gasInfo,
  ...flexProps
}: EvmTxInfoProps) => {
  const { currentChainId } = useCelatoneApp();

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
        {formatTokenWithValue(gasInfo.txFee)}
      </LabelText>
      <EvmTxGasReceipt gasInfo={gasInfo} />
    </Container>
  );
};
