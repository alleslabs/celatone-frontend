import type { ExposedFunction, IndexedModule, Option } from "lib/types";
import type { Dispatch, SetStateAction } from "react";

import { Accordion, Flex } from "@chakra-ui/react";
import InputWithIcon from "lib/components/InputWithIcon";
import { EmptyState } from "lib/components/state";
import { checkAvailability } from "lib/utils";
import { useMemo, useState } from "react";

import {
  FunctionAccordion,
  InteractionTabs,
  InteractionTypeSwitch,
  ModuleContainer,
  NoImageEmptyState,
} from "./common";

const EmptyStateRender = ({ desc }: { desc: string }) => (
  <ModuleContainer h="full">
    <EmptyState
      imageVariant="empty"
      imageWidth="80px"
      message={desc}
      textVariant="body2"
    />
  </ModuleContainer>
);

interface FunctionStates {
  filteredFunctions: Option<ExposedFunction[]>;
  isEmpty: boolean;
  noAvailableFns: boolean;
  noOtherFns: boolean;
}

const RenderFunctions = ({
  states,
  selectedFn,
  setSelectedFn,
  tab,
}: {
  states: FunctionStates;
  selectedFn: Option<ExposedFunction>;
  setSelectedFn: (fn: ExposedFunction) => void;
  tab: InteractionTabs;
}) => {
  if (!states.filteredFunctions)
    return (
      <EmptyStateRender desc="Available functions for selected modules will display here." />
    );
  if (states.isEmpty)
    return <NoImageEmptyState desc="No exposed_functions available" />;

  return (
    <Accordion allowMultiple defaultIndex={[0]}>
      <FunctionAccordion
        amptrackTab={tab}
        filteredFns={states.filteredFunctions.filter((fn) =>
          checkAvailability(fn)
        )}
        isEmpty={states.noAvailableFns}
        selectedFn={selectedFn}
        setSelectedFn={setSelectedFn}
        triggerText="Available functions"
      />
      {tab === InteractionTabs.EXECUTE_MODULE && (
        <FunctionAccordion
          amptrackTab={tab}
          filteredFns={states.filteredFunctions.filter(
            (fn) => !checkAvailability(fn)
          )}
          isEmpty={states.noOtherFns}
          selectedFn={selectedFn}
          setSelectedFn={setSelectedFn}
          triggerText="Other functions"
        />
      )}
    </Accordion>
  );
};

interface FunctionSelectPanelProps {
  module: Option<IndexedModule>;
  tab: InteractionTabs;
  setTab: Dispatch<SetStateAction<InteractionTabs>>;
  selectedFn: Option<ExposedFunction>;
  setSelectedFn: (fn: ExposedFunction) => void;
}

export const FunctionSelectPanel = ({
  module,
  tab,
  setTab,
  selectedFn,
  setSelectedFn,
}: FunctionSelectPanelProps) => {
  const [keyword, setKeyword] = useState("");

  const functionStates = useMemo<FunctionStates>(() => {
    const targetFunctions =
      tab === InteractionTabs.VIEW_MODULE
        ? module?.viewFunctions
        : module?.executeFunctions;
    return {
      filteredFunctions: targetFunctions?.filter((fn) =>
        fn.name.toLowerCase().includes(keyword.toLowerCase())
      ),
      isEmpty: targetFunctions?.length === 0,
      noAvailableFns:
        targetFunctions?.filter((fn) => checkAvailability(fn)).length === 0,
      noOtherFns:
        targetFunctions?.filter((fn) => !checkAvailability(fn)).length === 0,
    };
  }, [keyword, tab, module?.executeFunctions, module?.viewFunctions]);

  return (
    <div>
      <InputWithIcon
        amptrackSection="function-select-panel-search"
        placeholder="Search with function name"
        size="md"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <InteractionTypeSwitch
        counts={[module?.viewFunctions.length, module?.executeFunctions.length]}
        currentTab={tab}
        my={3}
        onTabChange={setTab}
      />
      {/* TODO: find a better way to handle height */}
      <Flex direction="column" maxH="calc(100vh - 400px)" overflow="scroll">
        <RenderFunctions
          selectedFn={selectedFn}
          setSelectedFn={setSelectedFn}
          states={functionStates}
          tab={tab}
        />
      </Flex>
    </div>
  );
};
