import type { TxDataJsonRpc } from "lib/services/types";
import type { HexAddr20, Option } from "lib/types";

import { Flex, Spinner, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { useEvmVerifyInfos } from "lib/services/verification/evm";

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
  const { data: evmVerifyInfos, isLoading: isEvmVerifInfosLoading } =
    useEvmVerifyInfos(
      contractAddress || to
        ? [contractAddress, to].filter((addr): addr is HexAddr20 => !!addr)
        : []
    );

  return (
    <EvmTxMethodAccordion
      content={
        <Flex gap={1}>
          Create{" "}
          {contractAddress ? (
            <>
              {isEvmVerifInfosLoading ? (
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
          )}{" "}
          via ERC20 factory
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
        label="ERC20 factory"
        value={
          to ? (
            <>
              {isEvmVerifInfosLoading ? (
                <Spinner boxSize={4} />
              ) : (
                <ExplorerLink
                  fixedHeight={false}
                  leftIcon={
                    <CustomIcon
                      boxSize={3}
                      color="primary.main"
                      name="contract-address"
                    />
                  }
                  showCopyOnHover
                  textFormat="normal"
                  textLabel={evmVerifyInfos?.[to.toLowerCase()]?.contractName}
                  type="evm_contract_address"
                  value={to}
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
      <EvmInfoLabelValue
        label="Created contract"
        value={
          contractAddress ? (
            <>
              {isEvmVerifInfosLoading ? (
                <Spinner boxSize={4} />
              ) : (
                <ExplorerLink
                  fixedHeight={false}
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
    </EvmTxMethodAccordion>
  );
};
