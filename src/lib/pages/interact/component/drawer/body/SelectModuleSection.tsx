import type { ModuleInteractionMobileStep } from "lib/pages/interact/types";
import type { IndexedModule, Option } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import InputWithIcon from "lib/components/InputWithIcon";
import { CountBadge, ModuleCard } from "lib/components/module";
import { useMoveVerifyInfosByAddress } from "lib/services/verification/move";
import { mergeModulePath } from "lib/utils";
import { useMemo, useState } from "react";

import type { SelectedAddress } from "../types";

import { NoImageEmptyState } from "../../common";

interface SelectModuleSectionProps {
  selectedAddress: SelectedAddress;
  modules: IndexedModule[];
  setStep?: (step: ModuleInteractionMobileStep) => void;
  selectedModule: Option<IndexedModule>;
  setSelectedModule: (module: IndexedModule) => void;
}

interface RenderModulesProps {
  selectedAddress: SelectedAddress;
  modulesLength: number;
  filtered: IndexedModule[];
  selectedModule: Option<IndexedModule>;
  setSelectedModule: (module: IndexedModule) => void;
  setStep?: (step: ModuleInteractionMobileStep) => void;
}

const RenderModules = ({
  selectedAddress,
  modulesLength,
  filtered,
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
        module={module}
        moveVerifyInfo={
          moveVerifyInfos?.[mergeModulePath(module.address, module.moduleName)]
        }
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
  selectedAddress,
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
        placeholder="Search with module name"
        size="md"
        value={keyword}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <Flex alignItems="center" gap={2} mt={6}>
        <Text color="text.dark" fontWeight={600} variant="body2">
          Modules
        </Text>
        <CountBadge count={modules.length} variant="common" />
      </Flex>
      <Flex
        direction="column"
        gap={2}
        // TODO: 100% - element and margin hack, find better way to setup the height
        h="calc(100% - 40px - 24px - 21px - 8px)"
        mt={2}
        overflowY="scroll"
      >
        <RenderModules
          filtered={filteredModules}
          modulesLength={modules.length}
          selectedAddress={selectedAddress}
          selectedModule={selectedModule}
          setSelectedModule={setSelectedModule}
          setStep={setStep}
        />
      </Flex>
    </>
  );
};
