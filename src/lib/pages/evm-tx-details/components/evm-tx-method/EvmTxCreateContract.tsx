import type { TxDataJsonRpc } from "lib/services/types";

import { Flex, Spinner, Tag, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { useCreatedContractsByEvmTxHash } from "lib/services/tx";
import { useEvmVerifyInfos } from "lib/services/verification/evm";

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
  const { data: evmVerifyInfos, isLoading: isEvmVerifyInfosLoading } =
    useEvmVerifyInfos(contracts);

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
              <>
                {isEvmVerifyInfosLoading ? (
                  <Spinner boxSize={4} />
                ) : (
                  <ExplorerLink
                    leftIcon={
                      <CustomIcon
                        boxSize={3}
                        color="primary.main"
                        name="contract-address"
                      />
                    }
                    showCopyOnHover
                    textLabel={
                      evmVerifyInfos?.[contracts[0].toLowerCase()]?.contractName
                    }
                    type="evm_contract_address"
                    value={contracts[0]}
                  />
                )}
              </>
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
            showCopyOnHover
            textFormat="normal"
            type="user_address"
            value={from}
          />
        }
      />
      <EvmInfoLabelValue
        label="Created contract"
        value={
          contracts.length > 0 ? (
            <Flex direction="column" gap={2}>
              {contracts.map((contract) =>
                isEvmVerifyInfosLoading ? (
                  <Spinner boxSize={4} />
                ) : (
                  <ExplorerLink
                    leftIcon={
                      <CustomIcon
                        boxSize={3}
                        color="primary.main"
                        name="contract-address"
                      />
                    }
                    showCopyOnHover
                    textFormat="normal"
                    textLabel={
                      evmVerifyInfos?.[contract.toLowerCase()]?.contractName
                    }
                    type="evm_contract_address"
                    value={contract}
                  />
                )
              )}
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
