import type { HexAddr20 } from "lib/types";

import { Flex, Spinner, Tag, Text } from "@chakra-ui/react";
import {
  flip,
  offset,
  useFloating,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import { useCreatedContractsByEvmTxHash } from "lib/services/tx";
import { useEvmVerifyInfos } from "lib/services/verification/evm";
import plur from "plur";
import { useState } from "react";

import { ExplorerLink } from "../ExplorerLink";
import { CustomIcon } from "../icon";

interface EvmToCellCreateProps {
  address: HexAddr20;
  evmTxHash?: string;
  isCompact?: boolean;
}

const EvmToCellCreateContracts = ({
  contracts,
}: {
  contracts: HexAddr20[];
}) => {
  const { data: evmVerifyInfos, isLoading: isEvmVerifyInfosLoading } =
    useEvmVerifyInfos(contracts);

  return contracts.map((contract) =>
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
        marginLeft={-2}
        showCopyOnHover
        textLabel={evmVerifyInfos?.[contract.toLowerCase()]?.contractName}
        type="evm_contract_address"
        value={contract}
      />
    )
  );
};

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

  const { context, floatingStyles, refs } = useFloating({
    middleware: [
      flip(),
      offset(({ placement, rects }) => {
        return {
          crossAxis: rects.reference.width / 2.5,
          mainAxis: placement.startsWith("bottom") ? -25 : -50,
        };
      }),
    ],
    onOpenChange: setIsOpen,
    open: isOpen,
    placement: "bottom-start",
  });

  const hover = useHover(context);

  const { getFloatingProps, getReferenceProps } = useInteractions([hover]);

  return (
    <Flex
      direction="column"
      w="100%"
      ref={refs.setReference}
      {...getReferenceProps()}
    >
      <Text color="text.disabled" variant="body3">
        Created {plur("Contract", contracts.length)}
      </Text>
      {isCompact && contracts.length > 1 ? (
        <>
          <Tag px={3} variant="primary" w="fit-content">
            {contracts.length}
          </Tag>
          {isOpen && (
            <Flex
              style={floatingStyles}
              direction="column"
              gap={2}
              ref={refs.setFloating}
              {...getFloatingProps()}
              bgColor="gray.800"
              borderRadius="8px"
              overflow="scroll"
              px={4}
              py={3}
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
