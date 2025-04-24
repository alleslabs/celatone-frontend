import type { IndexedModule } from "lib/types";

import { Box, Grid, GridItem } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import type {
  DisplayMode,
  ModuleSelectFunction,
  SelectedAddress,
} from "../types";

import { SelectFunctionSection } from "./SelectFunctionSection";
import { SelectModuleSection } from "./SelectModuleSection";

interface ModuleSelectBodyProps {
  closeModal: () => void;
  handleModuleSelect: ModuleSelectFunction;
  mode: DisplayMode;
  modules: IndexedModule[];
  selectedAddress: SelectedAddress;
}

export const DrawerBodyDesktop = ({
  closeModal,
  handleModuleSelect,
  mode,
  modules,
  selectedAddress,
}: ModuleSelectBodyProps) => {
  const [selectedModule, setSelectedModule] = useState<IndexedModule>();

  useEffect(() => {
    // clear selected module when modules change
    setSelectedModule(undefined);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(modules)]);

  return (
    <Grid
      columnGap={4}
      overflow="hidden"
      pointerEvents={mode === "input" ? "none" : undefined}
      position="relative"
      rowGap={6}
      templateAreas={`"panel main""button button"`}
      templateColumns="minmax(300px, 20%) 1fr"
      templateRows="1fr auto"
    >
      {mode === "input" && (
        <Box
          bgColor="background.overlay"
          h="full"
          opacity={0.8}
          pointerEvents="none"
          position="absolute"
          w="full"
          zIndex="overlay"
        />
      )}
      <GridItem area="panel" overflow="hidden">
        <SelectModuleSection
          modules={modules}
          selectedAddress={selectedAddress}
          selectedModule={selectedModule}
          setSelectedModule={setSelectedModule}
        />
      </GridItem>
      <SelectFunctionSection
        area="main"
        closeModal={closeModal}
        handleModuleSelect={handleModuleSelect}
        module={selectedModule}
      />
    </Grid>
  );
};
