import { Grid, GridItem, Text, Flex, Box, Button } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";
import { useMemo, useState } from "react";

import type {
  DisplayMode,
  ModuleSelectFunction,
  SelectedAddress,
} from "../types";
import InputWithIcon from "lib/components/InputWithIcon";
import { CountBadge } from "lib/components/module/CountBadge";
import { ModuleCard } from "lib/components/module/ModuleCard";
import type { IndexedModule } from "lib/services/moduleService";
import type { Option } from "lib/types";

import { ModuleEmptyState } from "./ModuleEmptyState";
import { ModuleFunctionBody } from "./ModuleFunctionBody";

interface ModuleSelectBodyProps {
  selectedAddress: SelectedAddress;
  modules: IndexedModule[];
  mode: DisplayMode;
  handleModuleSelect: ModuleSelectFunction;
  closeModal: () => void;
}

const RenderModules = ({
  selectedAddress,
  modulesLength,
  filtered,
  selectedModule,
  setSelectedModule,
}: {
  selectedAddress: SelectedAddress;
  modulesLength: number;
  filtered: IndexedModule[];
  selectedModule: Option<IndexedModule>;
  setSelectedModule: Dispatch<SetStateAction<Option<IndexedModule>>>;
}) => {
  if (!modulesLength)
    return (
      <ModuleEmptyState
        h="fit-content"
        p={4}
        description="This address does not have any modules."
        hasImage={false}
      />
    );
  return filtered?.length ? (
    <>
      {filtered.map((module) => (
        <ModuleCard
          key={module.moduleName}
          selectedAddress={selectedAddress.address}
          module={module}
          selectedModule={selectedModule}
          setSelectedModule={setSelectedModule}
        />
      ))}
    </>
  ) : (
    <ModuleEmptyState
      h="fit-content"
      p={4}
      description="No matching module found."
      hasImage={false}
    />
  );
};

export const ModuleSelectMainBody = ({
  selectedAddress,
  mode,
  modules,
  handleModuleSelect,
  closeModal,
}: ModuleSelectBodyProps) => {
  const [keyword, setKeyword] = useState("");
  const [selectedModule, setSelectedModule] = useState<IndexedModule>();

  const filteredModules = useMemo(
    () => modules.filter((each) => each.moduleName.includes(keyword)),
    [modules, keyword]
  );

  return (
    <Grid
      templateAreas={`"panel main""button button"`}
      columnGap={4}
      rowGap={6}
      templateColumns="300px 1fr"
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
        <InputWithIcon
          iconPosition="start"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search module ..."
        />
        <Flex alignItems="center" gap={2} mt={6}>
          <Text variant="body2" fontWeight={600} color="text.dark">
            Modules
          </Text>
          <CountBadge variant="common" count={modules.length} />
        </Flex>
        <Flex
          // TODO: 100% - element and margin hack, find better way to setup the height
          h="calc(100% - 40px - 24px - 21px - 8px)"
          overflowY="scroll"
          direction="column"
          gap={2}
          mt={2}
        >
          <RenderModules
            selectedAddress={selectedAddress}
            modulesLength={modules.length}
            filtered={filteredModules}
            selectedModule={selectedModule}
            setSelectedModule={setSelectedModule}
          />
        </Flex>
      </GridItem>
      {/* Left */}
      <ModuleFunctionBody
        area="main"
        module={selectedModule}
        handleModuleSelect={handleModuleSelect}
        closeModal={closeModal}
      />
      <GridItem area="button" justifySelf="flex-end">
        <Button
          size="md"
          onClick={() => {
            if (selectedModule) {
              handleModuleSelect(selectedModule);
              closeModal();
            }
          }}
          disabled={!selectedModule}
        >
          Select this module
        </Button>
      </GridItem>
    </Grid>
  );
};
