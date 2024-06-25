import { Grid } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

import type { ExposedFunction, IndexedModule, Option } from "lib/types";

import type { InteractionTabs } from "./common";
import { FunctionSelectBody } from "./FunctionSelectBody";
import { FunctionSelectPanel } from "./FunctionSelectPanel";

interface InteractionBodySectionProps {
  module: Option<IndexedModule>;
  selectedType: InteractionTabs;
  selectedFn: Option<ExposedFunction>;
  setSelectedType: Dispatch<SetStateAction<InteractionTabs>>;
  handleFunctionSelect: (fn: ExposedFunction) => void;
  onOpen: () => void;
}

export const InteractionBodySection = ({
  module,
  selectedType,
  setSelectedType,
  selectedFn,
  handleFunctionSelect,
  onOpen,
}: InteractionBodySectionProps) => (
  <Grid gap={8} templateColumns="minmax(300px, 20%) 1fr" overflow="hidden">
    <FunctionSelectPanel
      module={module}
      tab={selectedType}
      setTab={setSelectedType}
      selectedFn={selectedFn}
      setSelectedFn={handleFunctionSelect}
    />
    <FunctionSelectBody
      module={module}
      selectedFn={selectedFn}
      openDrawer={onOpen}
    />
  </Grid>
);
