import type { FlexProps } from "@chakra-ui/react";
import { chakra, Flex } from "@chakra-ui/react";

import type { GasInfo } from "../data";
import { useCelatoneApp } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import type { TxData, TxDataJsonRpc } from "lib/services/types";

import { EvmTxGasReceipt } from "./EvmTxGasReceipt";

interface EvmTxInfoMobileProps extends FlexProps {
  evmTxData: TxDataJsonRpc;
  cosmosTxData: TxData;
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
  gasInfo,
  ...flexProps
}: EvmTxInfoMobileProps) => {
  const { currentChainId } = useCelatoneApp();

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
      <EvmTxGasReceipt gasInfo={gasInfo} />
    </Container>
  );
};
