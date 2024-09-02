import {
  chakra,
  Heading,
  Stack,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
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
  const isMobile = useMobile();

  return isMobile ? (
    <Stack gap={4}>
      <Heading as="h6" variant="h6">
        Bytecode
      </Heading>
      <TextReadOnly text={code} canCopy />
    </Stack>
  ) : (
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
