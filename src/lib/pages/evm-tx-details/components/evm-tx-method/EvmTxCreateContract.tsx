import { Flex, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import type { TxDataJsonRpc } from "lib/services/types";

import { EvmTxMethodAccordion } from "./EvmTxMethodAccordion";
import { InfoLabelValue } from "./InformationRow";

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
            <Text>-</Text>
          )}
        </Flex>
      }
    >
      <InfoLabelValue
        label="Creator"
        value={
          <ExplorerLink type="user_address" value={from} showCopyOnHover />
        }
      />
      <InfoLabelValue
        label="Created Contract"
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
              />
            </Flex>
          ) : (
            <Text>-</Text>
          )
        }
      />
    </EvmTxMethodAccordion>
  );
};
