import { ButtonGroup, Flex, Text } from "@chakra-ui/react";
import { JsonFragment } from "ethers";
import { useInternalNavigate } from "lib/app-provider";
import { ContractCmdButton } from "lib/components/ContractCmdButton";
import { HexAddr20 } from "lib/types";
import { InteractTabsIndex, TabIndex } from "../../types";
import { getInteractTabsIndex } from "../../utils";

const getGroupTitle = (interactTab: InteractTabsIndex) => {
  switch (interactTab) {
    case InteractTabsIndex.Read:
      return "Read";
    case InteractTabsIndex.Write:
      return "Write";
    case InteractTabsIndex.ReadProxy:
      return "Read as Proxy";
    case InteractTabsIndex.WriteProxy:
    default:
      return "Write as Proxy";
  }
};

interface EvmContractCmdGroupProps {
  contractAddress: HexAddr20;
  abiSections: JsonFragment[];
  interactTab: InteractTabsIndex;
}

export const EvmContractCmdGroup = ({
  contractAddress,
  abiSections,
  interactTab,
}: EvmContractCmdGroupProps) => {
  const navigate = useInternalNavigate();

  const isRead = interactTab.startsWith("read");
  const isAsProxy = interactTab.endsWith("proxy");
  return (
    <Flex
      direction="column"
      flex={1}
      padding={4}
      bg="gray.900"
      borderRadius={8}
    >
      <Text color="text.dark" variant="body2" mb={2}>
        {getGroupTitle(interactTab)}
      </Text>
      {abiSections.length === 0 ? (
        <Text variant="body2" color="text.dark">
          No methods available
        </Text>
      ) : (
        <ButtonGroup
          flexWrap="wrap"
          sx={{
            "> button": {
              marginInlineStart: "0 !important",
              marginInlineEnd: "1",
            },
          }}
          gap={2}
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
                    tab: TabIndex.ReadWrite,
                    selectedType: getInteractTabsIndex(isRead, isAsProxy),
                    selectedFn: name,
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
