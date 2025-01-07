import { Box, Grid, GridItem } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import type {
  DisplayMode,
  ModuleSelectFunction,
  SelectedAddress,
} from "../types";
import type { IndexedModule } from "lib/types";

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
      templateAreas={`"panel main""button button"`}
      columnGap={4}
      overflow="hidden"
      pointerEvents={mode === "input" ? "none" : undefined}
      position="relative"
      rowGap={6}
      templateColumns="minmax(300px, 20%) 1fr"
      templateRows="1fr auto"
    >
      {mode === "input" && (
        <Box
          h="full"
          w="full"
          zIndex="overlay"
          bgColor="background.overlay"
          opacity={0.8}
          pointerEvents="none"
          position="absolute"
        />
      )}
      <GridItem area="panel" overflow="hidden">
        <SelectModuleSection
          selectedAddress={selectedAddress}
          modules={modules}
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
