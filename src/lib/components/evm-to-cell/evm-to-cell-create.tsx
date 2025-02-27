import { Flex, Tag, Text } from "@chakra-ui/react";

import {
  flip,
  offset,
  useFloating,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import plur from "plur";
import { useState } from "react";
import { useCreatedContractsByEvmTxHash } from "lib/services/tx";
import type { HexAddr20 } from "lib/types";
import { ExplorerLink } from "../ExplorerLink";
import { CustomIcon } from "../icon";

interface EvmToCellCreateProps {
  address: HexAddr20;
  evmTxHash?: string;
  isCompact?: boolean;
}

const EvmToCellCreateContracts = ({ contracts }: { contracts: HexAddr20[] }) =>
  contracts.map((contract) => (
    <Flex gap={1} align="center">
      <CustomIcon name="contract-address" boxSize={3} color="primary.main" />
      <ExplorerLink
        value={contract}
        type="evm_contract_address"
        showCopyOnHover
      />
    </Flex>
  ));

export const EvmToCellCreate = ({
  address,
  evmTxHash,
  isCompact,
}: EvmToCellCreateProps) => {
  const { data: contracts } = useCreatedContractsByEvmTxHash(
    evmTxHash,
    address
  );

  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-start",
    middleware: [
      flip(),
      offset(({ placement, rects }) => {
        return {
          mainAxis: placement.startsWith("bottom") ? -25 : -50,
          crossAxis: rects.reference.width / 2.5,
        };
      }),
    ],
  });

  const hover = useHover(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <Flex direction="column" ref={refs.setReference} {...getReferenceProps()}>
      <Text variant="body3" color="text.disabled">
        Created {plur("Contract", contracts.length)}
      </Text>
      {isCompact && contracts.length > 1 ? (
        <>
          <Tag variant="primary" w="fit-content" px={3}>
            {contracts.length}
          </Tag>
          {isOpen && (
            <Flex
              direction="column"
              gap={2}
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              bgColor="gray.800"
              px={4}
              py={3}
              borderRadius="8px"
              overflow="scroll"
            >
              <EvmToCellCreateContracts contracts={contracts} />
            </Flex>
          )}
        </>
      ) : (
        <EvmToCellCreateContracts contracts={contracts} />
      )}
    </Flex>
  );
};
