import { Button, Flex } from "@chakra-ui/react";

import { ModuleContainer } from "../common";
import { CustomIcon } from "lib/components/icon";
import { EmptyState } from "lib/components/state";
import type { IndexedModule } from "lib/services/moduleService";
import type { ExposedFunction, Option } from "lib/types";

import { SelectedFunctionCard } from "./SelectedFunctionCard";

interface FunctionSelectBodyProps {
  module: Option<IndexedModule>;
  selectedFn: Option<ExposedFunction>;
}

export const FunctionSelectBody = ({
  module,
  selectedFn,
}: FunctionSelectBodyProps) => {
  return selectedFn ? (
    <Flex direction="column">
      <SelectedFunctionCard fn={selectedFn} />
    </Flex>
  ) : (
    <ModuleContainer flexDirection="column" py={24}>
      {module ? (
        <Flex
          align="center"
          gap={6}
          h="20%"
          w="20%"
          alignSelf="flex-start"
          ml="40px"
        >
          <CustomIcon name="arrow-left" boxSize={6} color="gray.600" />
          <Flex
            h="full"
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
          <Button variant="primary">Select Module</Button>
        </>
      )}
    </ModuleContainer>
  );
};
