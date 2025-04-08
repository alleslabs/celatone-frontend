import type { FlexProps } from "@chakra-ui/react";
import type { TxData, TxDataJsonRpc } from "lib/services/types";
import type { TokenWithValue } from "lib/types";

import { chakra, Flex } from "@chakra-ui/react";
import { useCelatoneApp } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { TokenImageWithAmount } from "lib/components/token";

import type { GasInfo } from "../data";

import { EvmTxGasReceipt } from "./EvmTxGasReceipt";

interface EvmTxInfoProps extends FlexProps {
  evmTxData: TxDataJsonRpc;
  cosmosTxData: TxData;
  evmTxValue: TokenWithValue;
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
  evmTxValue,
  gasInfo,
  ...flexProps
}: EvmTxInfoProps) => {
  const { currentChainId } = useCelatoneApp();

  return (
    <Container {...flexProps}>
      <LabelText label="Network">{currentChainId}</LabelText>
      <LabelText label="Block height">
        <ExplorerLink
          ampCopierSection="tx_page_block_height"
          showCopyOnHover
          type="block_height"
          value={evmTxData.tx.blockNumber.toString()}
        />
      </LabelText>
      <LabelText label="Cosmos tx">
        <ExplorerLink
          showCopyOnHover
          type="tx_hash"
          value={cosmosTxData.txhash.toUpperCase()}
        />
      </LabelText>
      <LabelText label="Nonce">{evmTxData.tx.nonce.toFixed(0)}</LabelText>
      <LabelText label="Amount">
        <TokenImageWithAmount hasTrailingZeros={false} token={evmTxValue} />
      </LabelText>
      <EvmTxGasReceipt gasInfo={gasInfo} />
    </Container>
  );
};
