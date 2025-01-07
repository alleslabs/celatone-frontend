import { Button, Flex } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import { EmptyState } from "lib/components/state";
import type { ExposedFunction, IndexedModule, Option } from "lib/types";

import { ModuleContainer } from "./common";
import { ExecuteArea, ViewArea } from "./form";
import { SelectedFunctionCard } from "./SelectedFunctionCard";

interface FunctionSelectBodyProps {
  module: Option<IndexedModule>;
  openDrawer: () => void;
  selectedFn: Option<ExposedFunction>;
}

export const FunctionSelectBody = ({
  module,
  openDrawer,
  selectedFn,
}: FunctionSelectBodyProps) =>
  module && selectedFn ? (
    <Flex
      key={selectedFn.name + selectedFn.is_view}
      gap={8}
      maxW="full"
      direction="column"
    >
      <SelectedFunctionCard fn={selectedFn} />
      {selectedFn.is_view ? (
        <ViewArea
          fn={selectedFn}
          moduleAddress={module.address}
          moduleName={module.moduleName}
        />
      ) : (
        <ExecuteArea
          fn={selectedFn}
          moduleAddress={module.address}
          moduleName={module.moduleName}
        />
      )}
    </Flex>
  ) : (
    <ModuleContainer flexDirection="column">
      {module ? (
        <Flex align="center" alignSelf="flex-start" gap={6} ml="40px">
          <CustomIcon name="arrow-left" boxSize={6} color="gray.600" />
          <Flex
            gap={4}
            color="text.dark"
            direction="column"
            fontSize="14px"
            justifyContent="space-between"
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
            my={0}
            py={4}
            textVariant="body2"
          />
          <Button variant="primary" onClick={openDrawer}>
            Select Module
          </Button>
        </>
      )}
    </ModuleContainer>
  );
