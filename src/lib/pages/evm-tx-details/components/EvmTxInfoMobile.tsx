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

interface EvmTxInfoMobileProps extends FlexProps {
  cosmosTxData: TxData;
  evmTxData: TxDataJsonRpc;
  evmTxValue: TokenWithValue;
  gasInfo: GasInfo;
}

const Container = chakra(Flex, {
  baseStyle: {
    background: "gray.900",
    borderRadius: 2,
    flexDir: "column",
    gap: 6,
    marginY: 6,
    padding: 3,
  },
});

export const EvmTxInfoMobile = ({
  cosmosTxData,
  evmTxData,
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
            type="block_height"
            value={evmTxData.tx.blockNumber.toString()}
            ampCopierSection="tx_page_block_height"
            showCopyOnHover
          />
        </LabelText>
      </Flex>
      <Flex gap={1}>
        <LabelText flex={1} label="Cosmos Tx">
          <ExplorerLink
            fixedHeight={false}
            type="tx_hash"
            value={cosmosTxData.txhash.toUpperCase()}
            showCopyOnHover
          />
        </LabelText>
        <LabelText flex={1} label="Amount">
          <TokenImageWithAmount hasTrailingZeros={false} token={evmTxValue} />
        </LabelText>
      </Flex>
      <EvmTxGasReceipt gasInfo={gasInfo} />
    </Container>
  );
};
