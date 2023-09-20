import { Flex, Heading, Button } from "@chakra-ui/react";
import { useState } from "react";

// import { FunctionCard } from "lib/components/module";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import type { IndexedModule } from "lib/services/moduleService";
import { openNewTab } from "lib/utils";

import { FunctionTypeSwitch, FunctionTypeTabs } from "./FunctionTypeSwitch";

interface ModuleFunctionProps {
  moduleData: IndexedModule;
}

export const ModuleFunction = ({ moduleData }: ModuleFunctionProps) => {
  const [tab, setTab] = useState(FunctionTypeTabs.ALL);

  if (!moduleData) return <Loading />;

  const openFunctionJSON = () =>
    openNewTab(`${moduleData.parsedAbi.exposed_functions}`);

  return (
    <Flex direction="column" gap={8}>
      <Heading as="h6" variant="h6" fontWeight={600}>
        Exposed Function
      </Heading>
      <Flex>search input ja</Flex>
      <Flex justifyContent="space-between">
        <Flex>
          <FunctionTypeSwitch
            currentTab={tab}
            onTabChange={setTab}
            my={3}
            counts={[
              moduleData.parsedAbi.exposed_functions.length,
              moduleData.viewFunctions.length,
              moduleData.executeFunctions.length,
            ]}
          />
        </Flex>
        <Flex gap={4}>
          <Button
            variant="outline-primary"
            size="sm"
            rightIcon={<CustomIcon name="chevron-down" />}
          >
            Collapse
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            rightIcon={<CustomIcon name="launch" />}
            onClick={openFunctionJSON}
          >
            View in JSON
          </Button>
        </Flex>
      </Flex>
      {/* <FunctionCard /> */}
    </Flex>
  );
};
