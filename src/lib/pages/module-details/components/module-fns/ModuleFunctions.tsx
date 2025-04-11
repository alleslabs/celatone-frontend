import type { ExposedFunction, IndexedModule } from "lib/types";

import { Accordion, Button, Flex, Heading } from "@chakra-ui/react";
import {
  AmpEvent,
  track,
  trackUseExpandAll,
  trackUseViewJSON,
} from "lib/amplitude";
import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { EmptyState } from "lib/components/state";
import { useCallback, useMemo, useState } from "react";

import { FunctionTypeTabIndex } from "../../types";
import { FunctionDetailCard } from "./FunctionDetailCard";
import { FunctionTypeSwitch } from "./FunctionTypeSwitch";

interface ModuleFunctionsProps {
  address: IndexedModule["address"];
  moduleName: IndexedModule["moduleName"];
  fns: IndexedModule["parsedAbi"]["exposed_functions"];
  viewFns: IndexedModule["viewFunctions"];
  executeFns: IndexedModule["executeFunctions"];
  typeTab: FunctionTypeTabIndex;
}

const FunctionAccordions = ({
  fnType,
  address,
  moduleName,
  fns,
  expandedIndexes,
  updateExpandedIndexes,
}: {
  fnType: FunctionTypeTabIndex;
  address: IndexedModule["address"];
  moduleName: IndexedModule["moduleName"];
  fns: ExposedFunction[];
  expandedIndexes: number[];
  updateExpandedIndexes: (indexes: number[]) => void;
}) => (
  <Accordion
    id={fnType}
    allowMultiple
    display="none"
    index={expandedIndexes}
    onChange={updateExpandedIndexes}
  >
    {fns.length ? (
      <Flex direction="column" gap={{ base: 2, md: 4 }}>
        {fns.map((fn) => (
          <FunctionDetailCard
            key={fn.name}
            address={address}
            exposedFn={fn}
            fnType={fnType}
            moduleName={moduleName}
          />
        ))}
      </Flex>
    ) : (
      <EmptyState
        imageVariant="not-found"
        message="No functions match your search keyword."
        my={0}
        withBorder
      />
    )}
  </Accordion>
);

export const ModuleFunctions = ({
  address,
  moduleName,
  fns,
  viewFns,
  executeFns,
  typeTab,
}: ModuleFunctionsProps) => {
  const navigate = useInternalNavigate();

  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);
  const [keyword, setKeyword] = useState("");

  const [filteredFns, filteredViewFns, filteredExecuteFns] = useMemo(() => {
    if (!keyword) return [fns, viewFns, executeFns];
    return [
      fns.filter((fn) => fn.name.toLowerCase().includes(keyword.toLowerCase())),
      viewFns.filter((fn) =>
        fn.name.toLowerCase().includes(keyword.toLowerCase())
      ),
      executeFns.filter((fn) =>
        fn.name.toLowerCase().includes(keyword.toLowerCase())
      ),
    ];
  }, [executeFns, fns, keyword, viewFns]);

  const updateExpandedIndexes = (indexes: number[]) =>
    setExpandedIndexes(indexes);

  const handleTabChange = useCallback(
    (nextTab: FunctionTypeTabIndex) => {
      if (nextTab === typeTab) return;
      track(AmpEvent.USE_SUBTAB, { currentTab: nextTab });
      navigate({
        pathname: `/modules/[address]/[moduleName]/[tab]`,
        query: {
          address,
          moduleName,
          tab: "function",
          type: nextTab,
        },
        options: {
          shallow: true,
        },
      });
    },
    [address, moduleName, navigate, typeTab]
  );

  return (
    <Flex
      direction="column"
      gap={4}
      sx={{ [`& #${typeTab}`]: { display: "block" } }}
    >
      <Heading as="h6" fontWeight={600} minH="24px" variant="h6">
        Exposed Functions
      </Heading>
      <InputWithIcon
        amptrackSection="exposed-function-search"
        placeholder="Search with function name"
        size={{ base: "md", md: "lg" }}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <Flex
        alignItems="center"
        direction={{ base: "column", md: "row" }}
        justifyContent="space-between"
      >
        <FunctionTypeSwitch
          counts={[
            filteredFns.length,
            filteredViewFns.length,
            filteredExecuteFns.length,
          ]}
          currentTab={typeTab}
          my={3}
          onTabChange={handleTabChange}
        />
        <Flex
          alignItems="center"
          gap={{ base: 2, md: 4 }}
          my={{ base: 1, md: 0 }}
          w={{ base: "full", md: "auto" }}
        >
          <Button
            rightIcon={
              <CustomIcon
                boxSize={3}
                name={expandedIndexes.length ? "chevron-up" : "chevron-down"}
              />
            }
            size="sm"
            variant="outline-primary"
            w={{ base: "full", md: "auto" }}
            onClick={() => {
              trackUseExpandAll(
                expandedIndexes.length ? "collapse" : "expand",
                "Module function tab"
              );
              setExpandedIndexes((prev) =>
                !prev.length ? Array.from(Array(fns.length).keys()) : []
              );
            }}
          >
            {expandedIndexes.length ? "Collapse all" : "Expand all"}
          </Button>
          <Button
            rightIcon={<CustomIcon boxSize={3} name="launch" />}
            size="sm"
            variant="outline-primary"
            w={{ base: "full", md: "auto" }}
            onClick={() => {
              trackUseViewJSON("Module functions");
              const jsonString = JSON.stringify(fns, null, 2);
              const jsonWindow = window.open();
              if (jsonWindow) {
                // Modify styling later
                jsonWindow.document.write(
                  `<html><head><title>Module exposed function</title>`
                );

                // Add styling
                jsonWindow.document.write(
                  "<style>body { background-color: #f0f0f0; color: #333; }</style>"
                );

                jsonWindow.document.write(
                  `</head><body><pre>${jsonString}</pre></body></html>`
                );
              }
            }}
          >
            View in JSON
          </Button>
        </Flex>
      </Flex>
      {/* rendering all tabs at once and use css selector to avoid lagginess when changing tab */}
      <FunctionAccordions
        address={address}
        expandedIndexes={expandedIndexes}
        fns={filteredFns}
        fnType={FunctionTypeTabIndex.ALL}
        moduleName={moduleName}
        updateExpandedIndexes={updateExpandedIndexes}
      />
      <FunctionAccordions
        address={address}
        expandedIndexes={expandedIndexes}
        fns={filteredViewFns}
        fnType={FunctionTypeTabIndex.VIEW}
        moduleName={moduleName}
        updateExpandedIndexes={updateExpandedIndexes}
      />
      <FunctionAccordions
        address={address}
        expandedIndexes={expandedIndexes}
        fns={filteredExecuteFns}
        fnType={FunctionTypeTabIndex.EXECUTE}
        moduleName={moduleName}
        updateExpandedIndexes={updateExpandedIndexes}
      />
    </Flex>
  );
};
