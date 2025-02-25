import type { FlexProps } from "@chakra-ui/react";
import { chakra, Flex } from "@chakra-ui/react";

import { useCelatoneApp } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { TokenImageWithAmount } from "lib/components/token";
import type { TxData, TxDataJsonRpc } from "lib/services/types";
import type { TokenWithValue } from "lib/types";

import { EvmTxGasReceipt } from "./EvmTxGasReceipt";
import type { GasInfo } from "../data";

interface EvmTxInfoMobileProps extends FlexProps {
  evmTxData: TxDataJsonRpc;
  cosmosTxData: TxData;
  evmTxValue: TokenWithValue;
  gasInfo: GasInfo;
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
  evmTxValue,
  gasInfo,
  ...flexProps
}: EvmTxInfoMobileProps) => {
  const { currentChainId } = useCelatoneApp();

  return (
    <Container {...flexProps}>
      <Flex gap={1}>
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
      <Flex gap={1}>
        <LabelText flex={1} label="Cosmos Tx">
          <ExplorerLink
            value={cosmosTxData.txhash.toUpperCase()}
            type="tx_hash"
            showCopyOnHover
            fixedHeight={false}
          />
        </LabelText>
        <LabelText flex={1} label="Nonce">
          {evmTxData.tx.nonce.toFixed(0)}
        </LabelText>
      </Flex>
      <LabelText flex={1} label="Amount">
        <TokenImageWithAmount token={evmTxValue} hasTrailingZeros={false} />
      </LabelText>
      <EvmTxGasReceipt gasInfo={gasInfo} />
    </Container>
  );
};
