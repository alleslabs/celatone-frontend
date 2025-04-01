import { Accordion, Button, Flex, Heading } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";

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
import type { ExposedFunction, IndexedModule } from "lib/types";

import { FunctionDetailCard } from "./FunctionDetailCard";
import { FunctionTypeSwitch } from "./FunctionTypeSwitch";
import { FunctionTypeTabIndex } from "../../types";

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
    display="none"
    allowMultiple
    index={expandedIndexes}
    onChange={updateExpandedIndexes}
  >
    {fns.length ? (
      <Flex direction="column" gap={{ base: 2, md: 4 }}>
        {fns.map((fn) => (
          <FunctionDetailCard
            key={fn.name}
            fnType={fnType}
            exposedFn={fn}
            address={address}
            moduleName={moduleName}
          />
        ))}
      </Flex>
    ) : (
      <EmptyState
        my={0}
        imageVariant="not-found"
        message="No functions match your search keyword."
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
      <Heading as="h6" variant="h6" fontWeight={600} minH="24px">
        Exposed Functions
      </Heading>
      <InputWithIcon
        placeholder="Search with Function Name"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        size={{ base: "md", md: "lg" }}
        amptrackSection="exposed-function-search"
      />
      <Flex
        justifyContent="space-between"
        alignItems="center"
        direction={{ base: "column", md: "row" }}
      >
        <FunctionTypeSwitch
          currentTab={typeTab}
          onTabChange={handleTabChange}
          my={3}
          counts={[
            filteredFns.length,
            filteredViewFns.length,
            filteredExecuteFns.length,
          ]}
        />
        <Flex
          gap={{ base: 2, md: 4 }}
          my={{ base: 1, md: 0 }}
          alignItems="center"
          w={{ base: "full", md: "auto" }}
        >
          <Button
            variant="outline-primary"
            w={{ base: "full", md: "auto" }}
            size="sm"
            rightIcon={
              <CustomIcon
                name={expandedIndexes.length ? "chevron-up" : "chevron-down"}
                boxSize={3}
              />
            }
            onClick={() => {
              trackUseExpandAll(
                expandedIndexes.length ? "collapse" : "expand",
                "Module Function Tab"
              );
              setExpandedIndexes((prev) =>
                !prev.length ? Array.from(Array(fns.length).keys()) : []
              );
            }}
          >
            {expandedIndexes.length ? "Collapse All" : "Expand All"}
          </Button>
          <Button
            variant="outline-primary"
            w={{ base: "full", md: "auto" }}
            size="sm"
            rightIcon={<CustomIcon name="launch" boxSize={3} />}
            onClick={() => {
              trackUseViewJSON("Module Functions");
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
        fnType={FunctionTypeTabIndex.ALL}
        fns={filteredFns}
        expandedIndexes={expandedIndexes}
        updateExpandedIndexes={updateExpandedIndexes}
        address={address}
        moduleName={moduleName}
      />
      <FunctionAccordions
        fnType={FunctionTypeTabIndex.VIEW}
        fns={filteredViewFns}
        expandedIndexes={expandedIndexes}
        updateExpandedIndexes={updateExpandedIndexes}
        address={address}
        moduleName={moduleName}
      />
      <FunctionAccordions
        fnType={FunctionTypeTabIndex.EXECUTE}
        fns={filteredExecuteFns}
        expandedIndexes={expandedIndexes}
        updateExpandedIndexes={updateExpandedIndexes}
        address={address}
        moduleName={moduleName}
      />
    </Flex>
  );
};
