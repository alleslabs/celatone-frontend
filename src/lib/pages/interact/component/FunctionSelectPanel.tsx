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
    <Accordion defaultIndex={[0]} allowMultiple>
      <FunctionAccordion
        triggerText="Available functions"
        isEmpty={states.noAvailableFns}
        filteredFns={states.filteredFunctions.filter((fn) =>
          checkAvailability(fn)
        )}
        selectedFn={selectedFn}
        setSelectedFn={setSelectedFn}
        amptrackTab={tab}
      />
      {tab === InteractionTabs.EXECUTE_MODULE && (
        <FunctionAccordion
          triggerText="Other functions"
          isEmpty={states.noOtherFns}
          filteredFns={states.filteredFunctions.filter(
            (fn) => !checkAvailability(fn)
          )}
          selectedFn={selectedFn}
          setSelectedFn={setSelectedFn}
          amptrackTab={tab}
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
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search with Function Name"
        size="md"
        amptrackSection="function-select-panel-search"
      />
      <InteractionTypeSwitch
        currentTab={tab}
        onTabChange={setTab}
        my={3}
        counts={[module?.viewFunctions.length, module?.executeFunctions.length]}
      />
      {/* TODO: find a better way to handle height */}
      <Flex direction="column" maxH="calc(100vh - 400px)" overflow="scroll">
        <RenderFunctions
          states={functionStates}
          selectedFn={selectedFn}
          setSelectedFn={setSelectedFn}
          tab={tab}
        />
      </Flex>
    </div>
  );
};
