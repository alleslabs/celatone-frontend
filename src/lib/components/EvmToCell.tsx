import { Flex, Text } from "@chakra-ui/react";

import { EvmMethodName, type EvmToAddress, type Option } from "lib/types";

import { ExplorerLink } from "./ExplorerLink";
import { CustomIcon } from "./icon";

interface EvmToCellProps {
  toAddress: Option<EvmToAddress>;
}

export const EvmToCell = ({ toAddress }: EvmToCellProps) => {
  if (!toAddress)
    return (
      <Text variant="body2" color="text.dark">
        -
      </Text>
    );

  if (toAddress.toType === EvmMethodName.Create)
    return (
      <Flex direction="column">
        <Text variant="body3" color="text.disabled">
          Created Contract
        </Text>
        {/* TODO: fix contract addresses */}
        <Flex gap={1} align="center">
          <CustomIcon
            name="contract-address"
            boxSize={3}
            color="primary.main"
          />
          <ExplorerLink
            value={toAddress.address}
            type="evm_contract_address"
            showCopyOnHover
          />
        </Flex>
      </Flex>
    );

  if (toAddress.toType === EvmMethodName.CallErc20Factory)
    return (
      <Flex direction="column">
        <Text variant="body3" color="text.disabled">
          Created Contract
        </Text>
        <Flex gap={1} align="center">
          <CustomIcon
            name="contract-address"
            boxSize={3}
            color="primary.main"
          />
          <ExplorerLink
            value={toAddress.address}
            type="evm_contract_address"
            showCopyOnHover
          />
        </Flex>
      </Flex>
    );

  return (
    <ExplorerLink
      value={toAddress.address}
      type="user_address"
      showCopyOnHover
    />
  );
};
