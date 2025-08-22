import type { TxDataJsonRpc } from "lib/services/types";

import { Flex, Spinner, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { useEvmVerifyInfos } from "lib/services/verification/evm";

import { EvmInfoLabelValue } from "./EvmInfoLabelValue";

interface EvmTxDefaultProps {
  evmTxData: TxDataJsonRpc;
}

export const EvmTxDefault = ({ evmTxData }: EvmTxDefaultProps) => {
  const contractAddress = evmTxData.txReceipt.to;
  const { data: evmVerifyInfos, isLoading: isEvmVerifInfosLoading } =
    useEvmVerifyInfos(contractAddress ? [contractAddress] : []);

  return (
    <Flex direction="column" gap={4}>
      <EvmInfoLabelValue
        label="From"
        value={
          <ExplorerLink
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
          contractAddress ? (
            <>
              {isEvmVerifInfosLoading ? (
                <Spinner boxSize={4} />
              ) : (
                <ExplorerLink
                  showCopyOnHover
                  textFormat="normal"
                  textLabel={
                    evmVerifyInfos?.[contractAddress.toLowerCase()]
                      ?.contractName
                  }
                  type="evm_contract_address"
                  value={contractAddress}
                />
              )}
            </>
          ) : (
            <Text color="text.disabled" variant="body2">
              -
            </Text>
          )
        }
      />
    </Flex>
  );
};
