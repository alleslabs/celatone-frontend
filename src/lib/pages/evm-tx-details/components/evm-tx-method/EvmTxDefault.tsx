import type { TxDataJsonRpc } from "lib/services/types";

import { Flex, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";

import { EvmInfoLabelValue } from "./EvmInfoLabelValue";

interface EvmTxDefaultProps {
  evmTxData: TxDataJsonRpc;
}

export const EvmTxDefault = ({ evmTxData }: EvmTxDefaultProps) => (
  <Flex direction="column" gap={4}>
    <EvmInfoLabelValue
      label="From"
      value={
        <ExplorerLink
          fixedHeight={false}
          showCopyOnHover
          textFormat="normal"
          type="user_address"
          value={evmTxData.tx.from}
        />
      }
    />
    <EvmInfoLabelValue
      label="To"
      value={
        evmTxData.txReceipt.to ? (
          <ExplorerLink
            fixedHeight={false}
            showCopyOnHover
            textFormat="normal"
            type="evm_contract_address"
            value={evmTxData.txReceipt.to}
          />
        ) : (
          <Text color="text.disabled" variant="body2">
            -
          </Text>
        )
      }
    />
  </Flex>
);
