import type { TxDataJsonRpc } from "lib/services/types";

import { Flex, Tag, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { useCreatedContractsByEvmTxHash } from "lib/services/tx";

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
      content={
        <Flex gap={1}>
          Create{" "}
          {contracts.length > 0 ? (
            contracts.length > 1 ? (
              <>
                <Tag px={3} variant="primary">
                  {contracts.length}
                </Tag>
                <Text>contracts</Text>
              </>
            ) : (
              <Flex align="center" gap={1}>
                <CustomIcon
                  boxSize={3}
                  color="primary.main"
                  name="contract-address"
                />
                <ExplorerLink
                  showCopyOnHover
                  type="evm_contract_address"
                  value={contracts[0]}
                />
              </Flex>
            )
          ) : (
            <Text color="text.disabled" variant="body2">
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
            showCopyOnHover
            textFormat="normal"
            type="user_address"
            value={from}
          />
        }
      />
      <EvmInfoLabelValue
        label="Created Contract"
        value={
          contracts.length > 0 ? (
            <Flex direction="column" gap={2}>
              {contracts.map((contract) => (
                <Flex key={contract} align="center" gap={1}>
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
                    value={contract}
                  />
                </Flex>
              ))}
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
