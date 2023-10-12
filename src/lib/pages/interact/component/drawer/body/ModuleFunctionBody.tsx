import type { FlexProps, GridItemProps } from "@chakra-ui/react";
import { GridItem, Heading, Flex, Text } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";

import { ModuleEmptyState, NoImageEmptyState } from "../../common";
import type { ModuleSelectFunction } from "../types";
import InputWithIcon from "lib/components/InputWithIcon";
import { CountBadge } from "lib/components/module/CountBadge";
import { FunctionCard } from "lib/components/module/FunctionCard";
import type { IndexedModule } from "lib/services/moduleService";
import type { ExposedFunction, Option } from "lib/types";

const functionGridBaseStyle: FlexProps = {
  border: "1px solid",
  borderRadius: 8,
  borderColor: "gray.700",
  p: 4,
  direction: "column",
};

interface RenderFunctionsProps {
  exposedFnsLength: number;
  filtered: Option<ExposedFunction[]>;
  onFunctionSelect: (fn: ExposedFunction) => void;
}
const RenderFunctions = ({
  exposedFnsLength,
  filtered,
  onFunctionSelect,
}: RenderFunctionsProps) => {
  if (!exposedFnsLength)
    return <NoImageEmptyState desc="No exposed_functions available" />;
  return filtered?.length ? (
    <>
      {filtered.map((fn) => (
        <FunctionCard
          key={fn.name}
          exposedFn={fn}
          onFunctionSelect={onFunctionSelect}
        />
      ))}
    </>
  ) : (
    <NoImageEmptyState desc="No matching function found." />
  );
};

interface ModuleFunctionBodyProps extends GridItemProps {
  module: Option<IndexedModule>;
  handleModuleSelect: ModuleSelectFunction;
  closeModal: () => void;
}

export const ModuleFunctionBody = ({
  module,
  handleModuleSelect,
  closeModal,
  ...gridItemProps
}: ModuleFunctionBodyProps) => {
  const [keyword, setKeyword] = useState("");
  const [filteredView, filteredExecute] = useMemo(
    () => [
      module?.viewFunctions.filter((el) =>
        el.name.toLowerCase().includes(keyword.toLowerCase())
      ),
      module?.executeFunctions.filter((el) =>
        el.name.toLowerCase().includes(keyword.toLowerCase())
      ),
    ],
    [module?.viewFunctions, module?.executeFunctions, keyword]
  );

  const onFunctionSelect = useCallback(
    (fn: ExposedFunction) => {
      if (module) {
        handleModuleSelect(module, fn);
        closeModal();
      }
    },
    [module, handleModuleSelect, closeModal]
  );

  // TODO: 100% - element and margin hack, find better way to setup the height
  const maxHeight = "calc(100% - 22px - 32px - 40px)";
  return (
    <GridItem
      gap={4}
      {...functionGridBaseStyle}
      {...gridItemProps}
      overflow="hidden"
    >
      {module ? (
        <>
          <Heading as="h6" variant="h6" fontWeight={600}>
            {module.moduleName}
          </Heading>
          <InputWithIcon
            iconPosition="start"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search functions ..."
            my={4}
          />
          <Flex gap={6} h={maxHeight}>
            <Flex flex={0.5} gap={3} {...functionGridBaseStyle}>
              <Flex alignItems="center" gap={1}>
                <Text variant="body2" fontWeight={600} color="text.dark">
                  View Functions
                </Text>
                <CountBadge
                  count={module.viewFunctions.length}
                  variant="view"
                />
              </Flex>
              <Flex direction="column" gap={3} overflow="scroll">
                <RenderFunctions
                  exposedFnsLength={module.viewFunctions.length}
                  filtered={filteredView}
                  onFunctionSelect={onFunctionSelect}
                />
              </Flex>
            </Flex>
            <Flex flex={0.5} gap={3} {...functionGridBaseStyle}>
              <Flex alignItems="center" gap={1}>
                <Text variant="body2" fontWeight={600} color="text.dark">
                  Execute Functions
                </Text>
                <CountBadge
                  count={module.executeFunctions.length}
                  variant="execute"
                />
              </Flex>
              <Flex direction="column" gap={3} overflow="scroll">
                <RenderFunctions
                  exposedFnsLength={module.executeFunctions.length}
                  filtered={filteredExecute}
                  onFunctionSelect={onFunctionSelect}
                />
              </Flex>
            </Flex>
          </Flex>
        </>
      ) : (
        <ModuleEmptyState
          description="Choose a module to see its functions."
          imageWidth="80px"
          noBorder
          hasImage
        />
      )}
    </GridItem>
  );
};
