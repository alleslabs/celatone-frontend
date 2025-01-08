import { Flex, Heading, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import type { TxDataJsonRpc } from "lib/services/types";

import { EvmInfoLabelValue } from "./EvmInfoLabelValue";

interface EvmTxDefaultProps {
  evmTxData: TxDataJsonRpc;
}

export const EvmTxDefault = ({ evmTxData }: EvmTxDefaultProps) => (
  <>
    <Heading as="h6" variant="h6">
      Sender / Receiver
    </Heading>
    <Flex gap={4} direction="column">
      <EvmInfoLabelValue
        label="From"
        value={
          <ExplorerLink
            fixedHeight={false}
            type="user_address"
            value={evmTxData.tx.from}
            showCopyOnHover
            textFormat="normal"
          />
        }
      />
      <EvmInfoLabelValue
        label="To"
        value={
          evmTxData.txReceipt.to ? (
            <ExplorerLink
              fixedHeight={false}
              type="evm_contract_address"
              value={evmTxData.txReceipt.to}
              showCopyOnHover
              textFormat="normal"
            />
          ) : (
            <Text variant="body2" color="text.disabled">
              -
            </Text>
          )
        }
      />
    </Flex>
  </>
);
