import { Box, Grid, GridItem } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import type { DisplayMode, ModuleSelectFunction } from "../types";
import type { IndexedModule } from "lib/types";

import { SelectFunctionSection } from "./SelectFunctionSection";
import { SelectModuleSection } from "./SelectModuleSection";

interface ModuleSelectBodyProps {
  modules: IndexedModule[];
  mode: DisplayMode;
  handleModuleSelect: ModuleSelectFunction;
  closeModal: () => void;
}

export const DrawerBodyDesktop = ({
  mode,
  modules,
  handleModuleSelect,
  closeModal,
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
      rowGap={6}
      templateColumns="minmax(300px, 20%) 1fr"
      templateRows="1fr auto"
      position="relative"
      overflow="hidden"
      pointerEvents={mode === "input" ? "none" : undefined}
    >
      {mode === "input" && (
        <Box
          position="absolute"
          pointerEvents="none"
          bgColor="background.overlay"
          opacity={0.8}
          w="full"
          h="full"
          zIndex="overlay"
        />
      )}
      <GridItem area="panel" overflow="hidden">
        <SelectModuleSection
          modules={modules}
          selectedModule={selectedModule}
          setSelectedModule={setSelectedModule}
        />
      </GridItem>
      <SelectFunctionSection
        area="main"
        module={selectedModule}
        handleModuleSelect={handleModuleSelect}
        closeModal={closeModal}
      />
    </Grid>
  );
};
