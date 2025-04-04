import { Button, Flex } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import { EmptyState } from "lib/components/state";
import type { ExposedFunction, IndexedModule, Option } from "lib/types";

import { ModuleContainer } from "./common";
import { ExecuteArea, ViewArea } from "./form";
import { SelectedFunctionCard } from "./SelectedFunctionCard";

interface FunctionSelectBodyProps {
  module: Option<IndexedModule>;
  selectedFn: Option<ExposedFunction>;
  openDrawer: () => void;
}

export const FunctionSelectBody = ({
  module,
  selectedFn,
  openDrawer,
}: FunctionSelectBodyProps) =>
  module && selectedFn ? (
    <Flex
      key={selectedFn.name + selectedFn.is_view}
      direction="column"
      maxW="full"
      gap={8}
    >
      <SelectedFunctionCard fn={selectedFn} />
      {selectedFn.is_view ? (
        <ViewArea
          moduleAddress={module.address}
          moduleName={module.moduleName}
          fn={selectedFn}
        />
      ) : (
        <ExecuteArea
          moduleAddress={module.address}
          moduleName={module.moduleName}
          fn={selectedFn}
        />
      )}
    </Flex>
  ) : (
    <ModuleContainer flexDirection="column">
      {module ? (
        <Flex align="center" gap={6} alignSelf="flex-start" ml="40px">
          <CustomIcon name="arrow-left" boxSize={6} color="gray.600" />
          <Flex
            gap={4}
            color="text.dark"
            fontSize="14px"
            justifyContent="space-between"
            direction="column"
          >
            <p>Select available functions at the left panel.</p>
            <p>Functions input or response type will display here.</p>
          </Flex>
        </Flex>
      ) : (
        <>
          <EmptyState
            imageWidth="80px"
            imageVariant="empty"
            message={`Initiate your Module interactions by choosing a module and its associated function. ${"\n"} This section will showcase the input or response type required for the functions.`}
            textVariant="body2"
            my={0}
            py={4}
          />
          <Button variant="primary" onClick={openDrawer}>
            Select module
          </Button>
        </>
      )}
    </ModuleContainer>
  );
