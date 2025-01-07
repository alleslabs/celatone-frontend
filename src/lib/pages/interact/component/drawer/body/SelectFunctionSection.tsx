import type { FlexProps, GridItemProps } from "@chakra-ui/react";
import { Flex, GridItem, Heading, Text } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";

import { ModuleEmptyState, NoImageEmptyState } from "../../common";
import type { ModuleSelectFunction } from "../types";
import { AmpEvent, track } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import { CountBadge } from "lib/components/module/CountBadge";
import { FunctionCard } from "lib/components/module/FunctionCard";
import type { ExposedFunction, IndexedModule, Option } from "lib/types";

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
  closeModal: () => void;
  handleModuleSelect: ModuleSelectFunction;
  module: Option<IndexedModule>;
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
      gap={4}
      p={{ base: 0, md: 4 }}
      border={{ base: 0, md: "1px solid" }}
      borderColor={{ base: "transparent", md: "gray.700" }}
      {...functionGridBaseStyle}
      {...gridItemProps}
      overflow="hidden"
    >
      {module ? (
        <>
          {isMobile ? (
            <Heading as="h6" mt={6} variant="h6" fontWeight={600}>
              Select View Function
            </Heading>
          ) : (
            <Heading as="h6" variant="h6" fontWeight={600}>
              {module.moduleName}
            </Heading>
          )}
          <InputWithIcon
            my={4}
            size="md"
            value={keyword}
            amptrackSection="module-select-drawer-function-search"
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search with Function Name"
          />
          <Flex
            gap={6}
            h={{ base: "calc(100% - 125px)", md: maxHeight }}
            minH={{ md: "auto" }}
          >
            <Flex
              flex={{ base: 1, md: 0.5 }}
              gap={3}
              p={{ base: 0, md: 4 }}
              border={{ base: 0, md: "1px solid" }}
              borderColor={{ base: "transparent", md: "gray.700" }}
              {...functionGridBaseStyle}
            >
              {!isMobile && (
                <Flex alignItems="center" gap={1}>
                  <Text variant="body2" color="text.dark" fontWeight={600}>
                    View Functions
                  </Text>
                  <CountBadge
                    variant="view"
                    count={module.viewFunctions.length}
                  />
                </Flex>
              )}
              <Flex gap={3} pb={4} direction="column" overflow="scroll">
                <RenderFunctions
                  filtered={filteredView}
                  exposedFnsLength={module.viewFunctions.length}
                  onFunctionSelect={onFunctionSelect}
                />
              </Flex>
            </Flex>
            {!isMobile && (
              <Flex
                flex={0.5}
                gap={3}
                p={4}
                border="1px solid"
                borderColor="gray.700"
                {...functionGridBaseStyle}
              >
                <Flex alignItems="center" gap={1}>
                  <Text variant="body2" color="text.dark" fontWeight={600}>
                    Execute Functions
                  </Text>
                  <CountBadge
                    variant="execute"
                    count={module.executeFunctions.length}
                  />
                </Flex>
                <Flex gap={3} direction="column" overflow="scroll">
                  <RenderFunctions
                    filtered={filteredExecute}
                    exposedFnsLength={module.executeFunctions.length}
                    onFunctionSelect={onFunctionSelect}
                  />
                </Flex>
              </Flex>
            )}
          </Flex>
        </>
      ) : (
        <ModuleEmptyState
          imageWidth="80px"
          hasImage
          description="Choose a module to see its functions."
          noBorder
        />
      )}
    </GridItem>
  );
};
