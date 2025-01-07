import { Accordion, Flex } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";
import { useMemo, useState } from "react";

import InputWithIcon from "lib/components/InputWithIcon";
import { EmptyState } from "lib/components/state";
import type { ExposedFunction, IndexedModule, Option } from "lib/types";
import { checkAvailability } from "lib/utils";

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
      imageWidth="80px"
      imageVariant="empty"
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
  selectedFn,
  setSelectedFn,
  states,
  tab,
}: {
  selectedFn: Option<ExposedFunction>;
  setSelectedFn: (fn: ExposedFunction) => void;
  states: FunctionStates;
  tab: InteractionTabs;
}) => {
  if (!states.filteredFunctions)
    return (
      <EmptyStateRender desc="Available functions for selected modules will display here." />
    );
  if (states.isEmpty)
    return <NoImageEmptyState desc="No exposed_functions available" />;

  return (
    <Accordion defaultIndex={[0]} allowMultiple>
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
  selectedFn: Option<ExposedFunction>;
  setSelectedFn: (fn: ExposedFunction) => void;
  setTab: Dispatch<SetStateAction<InteractionTabs>>;
  tab: InteractionTabs;
}

export const FunctionSelectPanel = ({
  module,
  selectedFn,
  setSelectedFn,
  setTab,
  tab,
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
        size="md"
        value={keyword}
        amptrackSection="function-select-panel-search"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search with Function Name"
      />
      <InteractionTypeSwitch
        currentTab={tab}
        my={3}
        counts={[module?.viewFunctions.length, module?.executeFunctions.length]}
        onTabChange={setTab}
      />
      {/* TODO: find a better way to handle height */}
      <Flex maxH="calc(100vh - 400px)" direction="column" overflow="scroll">
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
