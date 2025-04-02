import type { TxDataJsonRpc } from "lib/services/types";
import type { HexAddr20, Option } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";

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
      content={
        <Flex gap={1}>
          Create{" "}
          {contractAddress ? (
            <Flex align="center" gap={1}>
              <CustomIcon
                boxSize={3}
                color="primary.main"
                name="contract-address"
              />
              <ExplorerLink
                showCopyOnHover
                type="evm_contract_address"
                value={contractAddress}
              />
            </Flex>
          ) : (
            <Text color="text.disabled" variant="body2">
              -
            </Text>
          )}{" "}
          via ERC20 Factory
        </Flex>
      }
      msgIcon="instantiate"
    >
      <EvmInfoLabelValue
        label="Creator"
        value={
          <ExplorerLink
            fixedHeight={false}
            showCopyOnHover
            textFormat="normal"
            type="user_address"
            value={from}
          />
        }
      />
      <EvmInfoLabelValue
        label="ERC20 Factory"
        value={
          to ? (
            <Flex align="center" gap={1}>
              <CustomIcon
                boxSize={3}
                color="primary.main"
                name="contract-address"
              />
              <ExplorerLink
                fixedHeight={false}
                showCopyOnHover
                textFormat="normal"
                type="evm_contract_address"
                value={to}
              />
            </Flex>
          ) : (
            <Text color="text.disabled" variant="body2">
              -
            </Text>
          )
        }
      />
      <EvmInfoLabelValue
        label="Created Contract"
        value={
          contractAddress ? (
            <Flex align="center" gap={1}>
              <CustomIcon
                boxSize={3}
                color="primary.main"
                name="contract-address"
              />
              <ExplorerLink
                fixedHeight={false}
                showCopyOnHover
                textFormat="normal"
                type="evm_contract_address"
                value={contractAddress}
              />
            </Flex>
          ) : (
            <Text color="text.disabled" variant="body2">
              -
            </Text>
          )
        }
      />
    </EvmTxMethodAccordion>
  );
};
