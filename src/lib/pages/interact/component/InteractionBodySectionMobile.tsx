import type { ExposedFunction, IndexedModule, Option } from "lib/types";

import { Button, Flex } from "@chakra-ui/react";
import { EmptyState } from "lib/components/state";

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
          {!module ? "Select Module" : "Select Function"}
        </Button>
      </Flex>
    )}
  </Flex>
);
