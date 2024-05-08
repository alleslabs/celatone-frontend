import { Button, Flex } from "@chakra-ui/react";

import { EmptyState } from "lib/components/state";
import type { ExposedFunction, IndexedModule, Option } from "lib/types";

import { ViewArea } from "./form";

interface InteractionBodySectionMobileProps {
  module: Option<IndexedModule>;
  selectedFn: Option<ExposedFunction>;
  openDrawer: () => void;
}

export const InteractionBodySectionMobile = ({
  module,
  selectedFn,
  openDrawer,
}: InteractionBodySectionMobileProps) => (
  <Flex>
    {module && selectedFn ? (
      <ViewArea
        moduleAddress={module.address}
        moduleName={module.moduleName}
        fn={selectedFn}
      />
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
          Select Module
        </Button>
      </>
    )}
  </Flex>
);
