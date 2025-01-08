import type { FlexProps } from "@chakra-ui/react";
import { chakra, Flex } from "@chakra-ui/react";

import type { GasInfo } from "../data";
import { useCelatoneApp } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { TokenImageWithAmount } from "lib/components/token";
import type { TxData, TxDataJsonRpc } from "lib/services/types";
import type { TokenWithValue } from "lib/types";

import { EvmTxGasReceipt } from "./EvmTxGasReceipt";

interface EvmTxInfoProps extends FlexProps {
  cosmosTxData: TxData;
  evmTxData: TxDataJsonRpc;
  evmTxValue: TokenWithValue;
  gasInfo: GasInfo;
}

const Container = chakra(Flex, {
  baseStyle: {
    flexDir: "column",
    gap: 6,
    minW: "180px",
    w: "250px",
  },
});

export const EvmTxInfo = ({
  cosmosTxData,
  evmTxData,
  evmTxValue,
  gasInfo,
  ...flexProps
}: EvmTxInfoProps) => {
  const { currentChainId } = useCelatoneApp();

  return (
    <Container {...flexProps}>
      <LabelText label="Network">{currentChainId}</LabelText>
      <LabelText label="Block Height">
        <ExplorerLink
          type="block_height"
          value={evmTxData.tx.blockNumber.toString()}
          ampCopierSection="tx_page_block_height"
          showCopyOnHover
        />
      </LabelText>
      <LabelText label="Cosmos Tx">
        <ExplorerLink
          type="tx_hash"
          value={cosmosTxData.txhash.toUpperCase()}
          showCopyOnHover
        />
      </LabelText>
      <LabelText label="Amount">
        <TokenImageWithAmount hasTrailingZeros={false} token={evmTxValue} />
      </LabelText>
      <EvmTxGasReceipt gasInfo={gasInfo} />
    </Container>
  );
};
