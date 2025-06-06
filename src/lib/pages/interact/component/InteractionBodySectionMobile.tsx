import type { ExposedFunction, IndexedModule, Option } from "lib/types";

import { Button, Flex } from "@chakra-ui/react";
import { EmptyState } from "lib/components/state";

import { ViewArea } from "./form";

interface InteractionBodySectionMobileProps {
  module: Option<IndexedModule>;
  openDrawer: () => void;
  selectedFn: Option<ExposedFunction>;
}

export const InteractionBodySectionMobile = ({
  module,
  openDrawer,
  selectedFn,
}: InteractionBodySectionMobileProps) => (
  <Flex>
    {module && selectedFn ? (
      <ViewArea
        fn={selectedFn}
        moduleAddress={module.address}
        moduleName={module.moduleName}
      />
    ) : (
      <Flex
        alignItems="center"
        border="1px solid"
        borderColor="gray.700"
        borderRadius={4}
        direction="column"
        justifyContent="center"
        p={8}
      >
        <EmptyState
          imageVariant="empty"
          imageWidth="80px"
          message={`Initiate your Module interactions by choosing its associated ${!module ? "module" : "function"}.`}
          my={0}
          py={4}
          textVariant="body2"
        />
        <Button variant="primary" onClick={openDrawer}>
          {!module ? "Select module" : "Select function"}
        </Button>
      </Flex>
    )}
  </Flex>
);
