import { Flex, Tag, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { useCreatedContractsByEvmTxHash } from "lib/services/tx";
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
  const { data: contracts = [] } = useCreatedContractsByEvmTxHash(
    evmTxData.tx.hash,
    contractAddress
  );

  return (
    <EvmTxMethodAccordion
      msgIcon="instantiate"
      content={
        <Flex gap={1}>
          Create{" "}
          {contracts.length > 0 ? (
            contracts.length > 1 ? (
              <>
                <Tag variant="primary" px={3}>
                  {contracts.length}
                </Tag>
                <Text>contracts</Text>
              </>
            ) : (
              <Flex gap={1} align="center">
                <CustomIcon
                  name="contract-address"
                  boxSize={3}
                  color="primary.main"
                />
                <ExplorerLink
                  value={contracts[0]}
                  type="evm_contract_address"
                  showCopyOnHover
                />
              </Flex>
            )
          ) : (
            <Text variant="body2" color="text.disabled">
              -
            </Text>
          )}
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
        label="Created Contract"
        value={
          contracts.length > 0 ? (
            <Flex direction="column" gap={2}>
              {contracts.map((contract) => (
                <Flex key={contract} gap={1} align="center">
                  <CustomIcon
                    name="contract-address"
                    boxSize={3}
                    color="primary.main"
                  />
                  <ExplorerLink
                    value={contract}
                    type="evm_contract_address"
                    showCopyOnHover
                    textFormat="normal"
                    fixedHeight={false}
                  />
                </Flex>
              ))}
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
