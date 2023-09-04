import { Flex, Grid, Text } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

import { CustomIcon } from "../icon";
import type { IndexedModule } from "lib/services/moduleService";
import type { Option } from "lib/types";

import { CountBadge } from "./CountBadge";

interface ModuleCardProps {
  module: IndexedModule;
  selectedModule: Option<IndexedModule>;
  setSelectedModule: Dispatch<SetStateAction<Option<IndexedModule>>>;
}

export const ModuleCard = ({
  module,
  selectedModule,
  setSelectedModule,
}: ModuleCardProps) => {
  const noExposedFunctions = !module.parsedAbi.exposed_functions.length;
  return (
    <Grid
      borderRadius={8}
      bgColor={
        module.moduleName === selectedModule?.moduleName
          ? "gray.700"
          : "gray.800"
      }
      p={3}
      alignItems="center"
      cursor="pointer"
      onClick={() => setSelectedModule(module)}
      gap={1}
      templateColumns="20px 1fr auto"
      _hover={{
        bg: "gray.700",
      }}
      transition=".25s all ease-out"
    >
      <CustomIcon name="contract-address" color="primary.main" boxSize={3} />
      <Flex align="center" overflow="hidden" gap={1}>
        <Text className="ellipsis" variant="body2">
          {module.moduleName}
        </Text>
        {!noExposedFunctions && (
          <CustomIcon
            name="check-circle-solid"
            color="success.main"
            boxSize={3}
          />
        )}
      </Flex>
      <Flex gap={1} ml="auto">
        <CountBadge count={module.viewFunctions.length} variant="view" />
        <CountBadge count={module.executeFunctions.length} variant="execute" />
      </Flex>
    </Grid>
  );
};
