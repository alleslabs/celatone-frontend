import { Flex, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";

import { NoImageEmptyState } from "../../common";
import InputWithIcon from "lib/components/InputWithIcon";
import { CountBadge, ModuleCard } from "lib/components/module";
import type { ModuleInteractionMobileStep } from "lib/pages/interact/types";
import type { IndexedModule, Option } from "lib/types";

interface SelectModuleSectionProps {
  modules: IndexedModule[];
  setStep?: (step: ModuleInteractionMobileStep) => void;
  selectedModule: Option<IndexedModule>;
  setSelectedModule: (module: IndexedModule) => void;
}

interface RenderModulesProps {
  modulesLength: number;
  filtered: IndexedModule[];
  selectedModule: Option<IndexedModule>;
  setSelectedModule: (module: IndexedModule) => void;
  setStep?: (step: ModuleInteractionMobileStep) => void;
}

const RenderModules = ({
  modulesLength,
  filtered,
  selectedModule,
  setSelectedModule,
  setStep,
}: RenderModulesProps) => {
  if (!modulesLength)
    return <NoImageEmptyState desc="This address does not have any modules." />;

  return filtered?.length ? (
    filtered.map((module) => (
      <ModuleCard
        key={module.moduleName}
        module={module}
        selectedModule={selectedModule}
        setSelectedModule={setSelectedModule}
        setStep={setStep}
      />
    ))
  ) : (
    <NoImageEmptyState desc="No matching module found." />
  );
};

export const SelectModuleSection = ({
  modules,
  selectedModule,
  setSelectedModule,
  setStep,
}: SelectModuleSectionProps) => {
  const [keyword, setKeyword] = useState("");

  const filteredModules = useMemo(
    () => modules.filter((each) => each.moduleName.includes(keyword)),
    [modules, keyword]
  );

  return (
    <>
      <InputWithIcon
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search with Module Name"
        size="md"
        amptrackSection="module-select-drawer-module-search"
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
          modulesLength={modules.length}
          filtered={filteredModules}
          selectedModule={selectedModule}
          setSelectedModule={setSelectedModule}
          setStep={setStep}
        />
      </Flex>
    </>
  );
};
