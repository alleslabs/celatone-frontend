import { Flex, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";

import { NoImageEmptyState } from "../../common";
import type { SelectedAddress } from "../types";
import InputWithIcon from "lib/components/InputWithIcon";
import { CountBadge, ModuleCard } from "lib/components/module";
import type { ModuleInteractionMobileStep } from "lib/pages/interact/types";
import { useMoveVerifyInfosByAddress } from "lib/services/verification/move";
import type { IndexedModule, Option } from "lib/types";
import { mergeModulePath } from "lib/utils";

interface RenderModulesProps {
  filtered: IndexedModule[];
  modulesLength: number;
  selectedAddress: SelectedAddress;
  selectedModule: Option<IndexedModule>;
  setSelectedModule: (module: IndexedModule) => void;
  setStep?: (step: ModuleInteractionMobileStep) => void;
}

interface SelectModuleSectionProps {
  modules: IndexedModule[];
  selectedAddress: SelectedAddress;
  selectedModule: Option<IndexedModule>;
  setSelectedModule: (module: IndexedModule) => void;
  setStep?: (step: ModuleInteractionMobileStep) => void;
}

const RenderModules = ({
  filtered,
  modulesLength,
  selectedAddress,
  selectedModule,
  setSelectedModule,
  setStep,
}: RenderModulesProps) => {
  const { data: moveVerifyInfos } = useMoveVerifyInfosByAddress(
    selectedAddress.hex
  );

  if (!modulesLength)
    return <NoImageEmptyState desc="This address does not have any modules." />;

  return filtered?.length ? (
    filtered.map((module) => (
      <ModuleCard
        key={module.moduleName}
        setStep={setStep}
        module={module}
        moveVerifyInfo={
          moveVerifyInfos?.[mergeModulePath(module.address, module.moduleName)]
        }
        selectedModule={selectedModule}
        setSelectedModule={setSelectedModule}
      />
    ))
  ) : (
    <NoImageEmptyState desc="No matching module found." />
  );
};

export const SelectModuleSection = ({
  modules,
  selectedAddress,
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
        size="md"
        value={keyword}
        amptrackSection="module-select-drawer-module-search"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search with Module Name"
      />
      <Flex alignItems="center" gap={2} mt={6}>
        <Text variant="body2" color="text.dark" fontWeight={600}>
          Modules
        </Text>
        <CountBadge variant="common" count={modules.length} />
      </Flex>
      <Flex
        gap={2}
        // TODO: 100% - element and margin hack, find better way to setup the height
        h="calc(100% - 40px - 24px - 21px - 8px)"
        mt={2}
        direction="column"
        overflowY="scroll"
      >
        <RenderModules
          filtered={filteredModules}
          selectedAddress={selectedAddress}
          setStep={setStep}
          modulesLength={modules.length}
          selectedModule={selectedModule}
          setSelectedModule={setSelectedModule}
        />
      </Flex>
    </>
  );
};
