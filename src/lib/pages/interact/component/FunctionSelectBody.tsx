import type { ExposedFunction, IndexedModule, Option } from "lib/types";

import { Button, Flex } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";
import { EmptyState } from "lib/components/state";

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
  openDrawer,
  selectedFn,
}: FunctionSelectBodyProps) =>
  module && selectedFn ? (
    <Flex
      key={selectedFn.name + selectedFn.is_view}
      direction="column"
      gap={8}
      maxW="full"
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
          <CustomIcon boxSize={6} color="gray.600" name="arrow-left" />
          <Flex
            color="text.dark"
            direction="column"
            fontSize="14px"
            gap={4}
            justifyContent="space-between"
          >
            <p>Select available functions at the left panel.</p>
            <p>Functions input or response type will display here.</p>
          </Flex>
        </Flex>
      ) : (
        <>
          <EmptyState
            imageVariant="empty"
            imageWidth="80px"
            message={`Initiate your Module interactions by choosing a module and its associated function. ${"\n"} This section will showcase the input or response type required for the functions.`}
            my={0}
            py={4}
            textVariant="body2"
          />
          <Button variant="primary" onClick={openDrawer}>
            Select module
          </Button>
        </>
      )}
    </ModuleContainer>
  );
