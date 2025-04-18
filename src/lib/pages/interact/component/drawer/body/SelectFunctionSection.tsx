import type { FlexProps, GridItemProps } from "@chakra-ui/react";
import type { ExposedFunction, IndexedModule, Option } from "lib/types";

import { Flex, GridItem, Heading, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import { CountBadge } from "lib/components/module/CountBadge";
import { FunctionCard } from "lib/components/module/FunctionCard";
import { useCallback, useMemo, useState } from "react";

import type { ModuleSelectFunction } from "../types";

import { ModuleEmptyState, NoImageEmptyState } from "../../common";

const functionGridBaseStyle: FlexProps = {
  borderRadius: 8,
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

export const SelectFunctionSection = ({
  closeModal,
  handleModuleSelect,
  module,
  ...gridItemProps
}: ModuleFunctionBodyProps) => {
  const isMobile = useMobile();
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
        track(AmpEvent.USE_MODULE_SELECTION_FUNCTION, {
          functionType: fn.is_view ? "view" : "Execute",
        });
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
      border={{ base: 0, md: "1px solid" }}
      borderColor={{ base: "transparent", md: "gray.700" }}
      gap={4}
      p={{ base: 0, md: 4 }}
      {...functionGridBaseStyle}
      {...gridItemProps}
      overflow="hidden"
    >
      {module ? (
        <>
          {isMobile ? (
            <Heading as="h6" fontWeight={600} mt={6} variant="h6">
              Select view function
            </Heading>
          ) : (
            <Heading as="h6" fontWeight={600} variant="h6">
              {module.moduleName}
            </Heading>
          )}
          <InputWithIcon
            amptrackSection="module-select-drawer-function-search"
            my={4}
            placeholder="Search with function name"
            size="md"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Flex
            gap={6}
            h={{ base: "calc(100% - 125px)", md: maxHeight }}
            minH={{ md: "auto" }}
          >
            <Flex
              border={{ base: 0, md: "1px solid" }}
              borderColor={{ base: "transparent", md: "gray.700" }}
              flex={{ base: 1, md: 0.5 }}
              gap={3}
              p={{ base: 0, md: 4 }}
              {...functionGridBaseStyle}
            >
              {!isMobile && (
                <Flex alignItems="center" gap={1}>
                  <Text color="text.dark" fontWeight={600} variant="body2">
                    View functions
                  </Text>
                  <CountBadge
                    count={module.viewFunctions.length}
                    variant="view"
                  />
                </Flex>
              )}
              <Flex direction="column" gap={3} overflow="scroll" pb={4}>
                <RenderFunctions
                  exposedFnsLength={module.viewFunctions.length}
                  filtered={filteredView}
                  onFunctionSelect={onFunctionSelect}
                />
              </Flex>
            </Flex>
            {!isMobile && (
              <Flex
                border="1px solid"
                borderColor="gray.700"
                flex={0.5}
                gap={3}
                p={4}
                {...functionGridBaseStyle}
              >
                <Flex alignItems="center" gap={1}>
                  <Text color="text.dark" fontWeight={600} variant="body2">
                    Execute functions
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
            )}
          </Flex>
        </>
      ) : (
        <ModuleEmptyState
          description="Choose a module to see its functions."
          hasImage
          imageWidth="80px"
          noBorder
        />
      )}
    </GridItem>
  );
};
