import { Flex, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import type { TxDataJsonRpc } from "lib/services/types";
import type { HexAddr20, Option } from "lib/types";

import { EvmInfoLabelValue } from "./EvmInfoLabelValue";
import { EvmTxMethodAccordion } from "./EvmTxMethodAccordion";

interface EvmTxCallErc20FactoryProps {
  evmTxData: TxDataJsonRpc;
}

export const EvmTxCallErc20Factory = ({
  evmTxData,
}: EvmTxCallErc20FactoryProps) => {
  const { from, to } = evmTxData.tx;
  const { logs } = evmTxData.txReceipt;
  const contractAddress = logs[0]?.address as Option<HexAddr20>;

  return (
    <EvmTxMethodAccordion
      msgIcon="instantiate"
      content={
        <Flex gap={1}>
          Create{" "}
          {contractAddress ? (
            <Flex gap={1} align="center">
              <CustomIcon
                name="contract-address"
                boxSize={3}
                color="primary.main"
              />
              <ExplorerLink
                value={contractAddress}
                type="evm_contract_address"
                showCopyOnHover
              />
            </Flex>
          ) : (
            <Text variant="body2" color="text.disabled">
              -
            </Text>
          )}{" "}
          via ERC20 factory
        </Flex>
      }
    >
      <EvmInfoLabelValue
        label="Creator"
        value={
          <ExplorerLink
            type="user_address"
            value={from}
            showCopyOnHover
            textFormat="normal"
            fixedHeight={false}
          />
        }
      />
      <EvmInfoLabelValue
        label="ERC20 factory"
        value={
          to ? (
            <Flex gap={1} align="center">
              <CustomIcon
                name="contract-address"
                boxSize={3}
                color="primary.main"
              />
              <ExplorerLink
                value={to}
                type="evm_contract_address"
                showCopyOnHover
                textFormat="normal"
                fixedHeight={false}
              />
            </Flex>
          ) : (
            <Text variant="body2" color="text.disabled">
              -
            </Text>
          )
        }
      />
      <EvmInfoLabelValue
        label="Created contract"
        value={
          contractAddress ? (
            <Flex gap={1} align="center">
              <CustomIcon
                name="contract-address"
                boxSize={3}
                color="primary.main"
              />
              <ExplorerLink
                value={contractAddress}
                type="evm_contract_address"
                showCopyOnHover
                textFormat="normal"
                fixedHeight={false}
              />
            </Flex>
          ) : (
            <Text variant="body2" color="text.disabled">
              -
            </Text>
          )
        }
      />
    </EvmTxMethodAccordion>
  );
};
