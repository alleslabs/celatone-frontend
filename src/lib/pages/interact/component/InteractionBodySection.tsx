import type { ExposedFunction, IndexedModule, Option } from "lib/types";
import type { Dispatch, SetStateAction } from "react";

import { Grid } from "@chakra-ui/react";

import type { InteractionTabs } from "./common";

import { FunctionSelectBody } from "./FunctionSelectBody";
import { FunctionSelectPanel } from "./FunctionSelectPanel";

interface InteractionBodySectionProps {
  handleFunctionSelect: (fn: ExposedFunction) => void;
  module: Option<IndexedModule>;
  onOpen: () => void;
  selectedFn: Option<ExposedFunction>;
  selectedType: InteractionTabs;
  setSelectedType: Dispatch<SetStateAction<InteractionTabs>>;
}

export const InteractionBodySection = ({
  handleFunctionSelect,
  module,
  onOpen,
  selectedFn,
  selectedType,
  setSelectedType,
}: InteractionBodySectionProps) => (
  <Grid gap={8} overflow="hidden" templateColumns="minmax(300px, 20%) 1fr">
    <FunctionSelectPanel
      module={module}
      selectedFn={selectedFn}
      setSelectedFn={handleFunctionSelect}
      setTab={setSelectedType}
      tab={selectedType}
    />
    <FunctionSelectBody
      module={module}
      openDrawer={onOpen}
      selectedFn={selectedFn}
    />
  </Grid>
);
