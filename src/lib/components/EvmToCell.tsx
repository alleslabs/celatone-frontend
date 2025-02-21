import { Flex, Text } from "@chakra-ui/react";

import type { EvmToAddress, HexAddr20, Option } from "lib/types";
import { EvmMethodName } from "lib/types";

import { ExplorerLink } from "./ExplorerLink";
import { CustomIcon } from "./icon";

interface EvmToCellProps {
  toAddress: Option<EvmToAddress>;
}

const EvmToCellCreate = ({
  address,
}: {
  address: HexAddr20;
  evmTxHash?: string;
}) => (
  <Flex direction="column">
    <Text variant="body3" color="text.disabled">
      Created Contract
    </Text>
    {/* TODO: fix contract addresses */}
    <Flex gap={1} align="center">
      <CustomIcon name="contract-address" boxSize={3} color="primary.main" />
      <ExplorerLink
        value={address}
        type="evm_contract_address"
        showCopyOnHover
      />
    </Flex>
  </Flex>
);

export const EvmToCell = ({ toAddress }: EvmToCellProps) => {
  if (!toAddress)
    return (
      <Text variant="body2" color="text.dark">
        -
      </Text>
    );

  if (toAddress.toType === EvmMethodName.Create)
    return (
      <EvmToCellCreate
        address={toAddress.address}
        evmTxHash={toAddress.evmTxHash}
      />
    );

  if (toAddress.toType === EvmMethodName.CallErc20Factory)
    return <EvmToCellCreate address={toAddress.address} />;

  return (
    <ExplorerLink
      value={toAddress.address}
      type="user_address"
      showCopyOnHover
    />
  );
};
