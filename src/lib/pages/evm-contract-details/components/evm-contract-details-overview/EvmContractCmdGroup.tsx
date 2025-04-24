import type { JsonFragment } from "ethers";
import type { HexAddr20 } from "lib/types";

import { ButtonGroup, Flex, Text } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { ContractCmdButton } from "lib/components/ContractCmdButton";

import { InteractTabsIndex, TabIndex } from "../../types";
import { getInteractTabsIndex } from "../../utils";

const getGroupTitle = (interactTab: InteractTabsIndex) => {
  switch (interactTab) {
    case InteractTabsIndex.Read:
      return "Read";
    case InteractTabsIndex.ReadProxy:
      return "Read as Proxy";
    case InteractTabsIndex.Write:
      return "Write";
    case InteractTabsIndex.WriteProxy:
    default:
      return "Write as Proxy";
  }
};

interface EvmContractCmdGroupProps {
  abiSections: JsonFragment[];
  contractAddress: HexAddr20;
  interactTab: InteractTabsIndex;
}

export const EvmContractCmdGroup = ({
  abiSections,
  contractAddress,
  interactTab,
}: EvmContractCmdGroupProps) => {
  const navigate = useInternalNavigate();

  const isRead = interactTab.startsWith("read");
  const isAsProxy = interactTab.endsWith("proxy");
  return (
    <Flex
      bg="gray.900"
      borderRadius={8}
      direction="column"
      flex={1}
      padding={4}
    >
      <Text color="text.dark" mb={2} variant="body2">
        {getGroupTitle(interactTab)}
      </Text>
      {abiSections.length === 0 ? (
        <Text color="text.dark" variant="body2">
          No methods available
        </Text>
      ) : (
        <ButtonGroup
          flexWrap="wrap"
          gap={2}
          sx={{
            "> button": {
              marginInlineEnd: "1",
              marginInlineStart: "0 !important",
            },
          }}
        >
          {abiSections.sort().map(({ name }, index) => (
            <ContractCmdButton
              key={`${interactTab}-cmd-${name}-${index}`}
              cmd={name}
              onClickCmd={() => {
                navigate({
                  pathname: "/evm-contracts/[contractAddress]/[tab]",
                  query: {
                    contractAddress,
                    selectedFn: name,
                    selectedType: getInteractTabsIndex(isRead, isAsProxy),
                    tab: TabIndex.ReadWrite,
                  },
                });
              }}
            />
          ))}
        </ButtonGroup>
      )}
    </Flex>
  );
};
