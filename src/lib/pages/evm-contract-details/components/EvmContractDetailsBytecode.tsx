import { chakra, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

import { CustomTab } from "lib/components/CustomTab";
import { TextReadOnly } from "lib/components/json/TextReadOnly";

const StyledCustomTab = chakra(CustomTab, {
  baseStyle: {
    border: "unset",
    borderRadius: "4px",
    _selected: { bgColor: "gray.800", color: "white" },
    width: "256px",
  },
});

interface EvmContractDetailsBytecodeProps {
  code: string;
}

export const EvmContractDetailsBytecode = ({
  code,
}: EvmContractDetailsBytecodeProps) => {
  return (
    <Tabs
      variant="unstyled"
      orientation="vertical"
      index={0}
      isLazy
      lazyBehavior="keepMounted"
    >
      <TabList id="1">
        <StyledCustomTab>Bytecode</StyledCustomTab>
      </TabList>
      <TabPanels>
        <TabPanel p={0} pl={6}>
          <TextReadOnly text={code} canCopy />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
