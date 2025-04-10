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
            ampCopierSection="tx_page_block_height"
            showCopyOnHover
            type="block_height"
            value={evmTxData.tx.blockNumber.toString()}
          />
        </LabelText>
      </Flex>
      <Flex gap={1}>
        <LabelText flex={1} label="Cosmos tx">
          <ExplorerLink
            fixedHeight={false}
            showCopyOnHover
            type="tx_hash"
            value={cosmosTxData.txhash.toUpperCase()}
          />
        </LabelText>
        <LabelText flex={1} label="Nonce">
          {evmTxData.tx.nonce.toFixed(0)}
        </LabelText>
      </Flex>
      <LabelText flex={1} label="Amount">
        <TokenImageWithAmount hasTrailingZeros={false} token={evmTxValue} />
      </LabelText>
      <EvmTxGasReceipt gasInfo={gasInfo} />
    </Container>
  );
};
