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
    <Flex direction="column" gap={4}>
      <EvmInfoLabelValue
        label="From"
        value={
          <ExplorerLink
            type="user_address"
            value={evmTxData.tx.from}
            showCopyOnHover
            textFormat="normal"
            fixedHeight={false}
          />
        }
      />
      <EvmInfoLabelValue
        label="To"
        value={
          evmTxData.txReceipt.to ? (
            <ExplorerLink
              type="user_address"
              value={evmTxData.txReceipt.to}
              showCopyOnHover
              textFormat="normal"
              fixedHeight={false}
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
