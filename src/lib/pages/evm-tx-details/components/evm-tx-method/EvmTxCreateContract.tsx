import { Flex, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import type { TxDataJsonRpc } from "lib/services/types";

import { EvmInfoLabelValue } from "./EvmInfoLabelValue";
import { EvmTxMethodAccordion } from "./EvmTxMethodAccordion";

interface EvmTxCreateContractProps {
  evmTxData: TxDataJsonRpc;
}

export const EvmTxCreateContract = ({
  evmTxData,
}: EvmTxCreateContractProps) => {
  const { from } = evmTxData.tx;
  const { contractAddress } = evmTxData.txReceipt;

  return (
    <EvmTxMethodAccordion
      content={
        <Flex gap={1}>
          Create{" "}
          {contractAddress ? (
            <Flex align="center" gap={1}>
              <CustomIcon
                name="contract-address"
                boxSize={3}
                color="primary.main"
              />
              <ExplorerLink
                type="evm_contract_address"
                value={contractAddress}
                showCopyOnHover
              />
            </Flex>
          ) : (
            <Text variant="body2" color="text.disabled">
              -
            </Text>
          )}
        </Flex>
      }
      msgIcon="instantiate"
    >
      <EvmInfoLabelValue
        label="Creator"
        value={
          <ExplorerLink
            fixedHeight={false}
            type="user_address"
            value={from}
            showCopyOnHover
            textFormat="normal"
          />
        }
      />
      <EvmInfoLabelValue
        label="Created Contract"
        value={
          contractAddress ? (
            <Flex align="center" gap={1}>
              <CustomIcon
                name="contract-address"
                boxSize={3}
                color="primary.main"
              />
              <ExplorerLink
                fixedHeight={false}
                type="evm_contract_address"
                value={contractAddress}
                showCopyOnHover
                textFormat="normal"
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
