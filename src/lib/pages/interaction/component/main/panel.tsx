import { Accordion, Flex } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";
import { useMemo, useState } from "react";

import {
  NoImageEmptyState,
  ModuleContainer,
  InteractionTabs,
  InteractionTypeSwitch,
} from "../common";
import { FunctionAccordion } from "../common/FunctionAccordion";
import InputWithIcon from "lib/components/InputWithIcon";
import { EmptyState } from "lib/components/state";
import type { IndexedModule } from "lib/services/moduleService";
import type { ExposedFunction, Option } from "lib/types";
import { checkAvailability } from "lib/utils";

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
}: {
  states: FunctionStates;
  selectedFn: Option<ExposedFunction>;
  setSelectedFn: Dispatch<SetStateAction<Option<ExposedFunction>>>;
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
      />
      <FunctionAccordion
        triggerText="Other functions"
        isEmpty={states.noOtherFns}
        filteredFns={states.filteredFunctions.filter(
          (fn) => !checkAvailability(fn)
        )}
        selectedFn={selectedFn}
        setSelectedFn={setSelectedFn}
      />
    </Accordion>
  );
};

interface FunctionSelectPanelProps {
  module: Option<IndexedModule>;
  selectedFn: Option<ExposedFunction>;
  setSelectedFn: Dispatch<SetStateAction<Option<ExposedFunction>>>;
}

export const FunctionSelectPanel = ({
  module,
  selectedFn,
  setSelectedFn,
}: FunctionSelectPanelProps) => {
  const [tab, setTab] = useState(InteractionTabs.VIEW_MODULE);
  const [keyword, setKeyword] = useState("");

  const functionStates = useMemo<FunctionStates>(() => {
    const targetFunctions =
      tab === InteractionTabs.VIEW_MODULE
        ? module?.viewFunctions
        : module?.executeFunctions;
    return {
      filteredFunctions: targetFunctions?.filter((fn) =>
        fn.name.includes(keyword)
      ),
      isEmpty: targetFunctions?.length === 0,
      noAvailableFns:
        targetFunctions?.filter((fn) => checkAvailability(fn)).length === 0,
      noOtherFns:
        targetFunctions?.filter((fn) => !checkAvailability(fn)).length === 0,
    };
  }, [keyword, tab, module?.executeFunctions, module?.viewFunctions]);

  // TODO: find a better way to handle height
  return (
    <Flex direction="column" maxH="calc(100vh - 364px)" overflow="scroll">
      <InputWithIcon
        iconPosition="start"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search functions ..."
      />
      <InteractionTypeSwitch
        currentTab={tab}
        onTabChange={setTab}
        my={3}
        counts={[module?.viewFunctions.length, module?.executeFunctions.length]}
      />
      <RenderFunctions
        states={functionStates}
        selectedFn={selectedFn}
        setSelectedFn={setSelectedFn}
      />
    </Flex>
  );
};
