import { Accordion, Button, Flex, Heading } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";

import { FunctionTypeTabIndex } from "../../types";
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

interface ModuleFunctionsProps {
  address: IndexedModule["address"];
  executeFns: IndexedModule["executeFunctions"];
  fns: IndexedModule["parsedAbi"]["exposed_functions"];
  moduleName: IndexedModule["moduleName"];
  typeTab: FunctionTypeTabIndex;
  viewFns: IndexedModule["viewFunctions"];
}

const FunctionAccordions = ({
  address,
  expandedIndexes,
  fns,
  fnType,
  moduleName,
  updateExpandedIndexes,
}: {
  address: IndexedModule["address"];
  expandedIndexes: number[];
  fns: ExposedFunction[];
  fnType: FunctionTypeTabIndex;
  moduleName: IndexedModule["moduleName"];
  updateExpandedIndexes: (indexes: number[]) => void;
}) => (
  <Accordion
    id={fnType}
    display="none"
    index={expandedIndexes}
    allowMultiple
    onChange={updateExpandedIndexes}
  >
    {fns.length ? (
      <Flex gap={{ base: 2, md: 4 }} direction="column">
        {fns.map((fn) => (
          <FunctionDetailCard
            key={fn.name}
            address={address}
            fnType={fnType}
            exposedFn={fn}
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
  executeFns,
  fns,
  moduleName,
  typeTab,
  viewFns,
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
        options: {
          shallow: true,
        },
        pathname: `/modules/[address]/[moduleName]/[tab]`,
        query: {
          address,
          moduleName,
          tab: "function",
          type: nextTab,
        },
      });
    },
    [address, moduleName, navigate, typeTab]
  );

  return (
    <Flex
      gap={4}
      sx={{ [`& #${typeTab}`]: { display: "block" } }}
      direction="column"
    >
      <Heading as="h6" minH="24px" variant="h6" fontWeight={600}>
        Exposed Functions
      </Heading>
      <InputWithIcon
        size={{ base: "md", md: "lg" }}
        value={keyword}
        amptrackSection="exposed-function-search"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search with Function Name"
      />
      <Flex
        alignItems="center"
        direction={{ base: "column", md: "row" }}
        justifyContent="space-between"
      >
        <FunctionTypeSwitch
          currentTab={typeTab}
          my={3}
          counts={[
            filteredFns.length,
            filteredViewFns.length,
            filteredExecuteFns.length,
          ]}
          onTabChange={handleTabChange}
        />
        <Flex
          alignItems="center"
          gap={{ base: 2, md: 4 }}
          my={{ base: 1, md: 0 }}
          w={{ base: "full", md: "auto" }}
        >
          <Button
            size="sm"
            variant="outline-primary"
            w={{ base: "full", md: "auto" }}
            onClick={() => {
              trackUseExpandAll(
                expandedIndexes.length ? "collapse" : "expand",
                "Module Function Tab"
              );
              setExpandedIndexes((prev) =>
                !prev.length ? Array.from(Array(fns.length).keys()) : []
              );
            }}
            rightIcon={
              <CustomIcon
                name={expandedIndexes.length ? "chevron-up" : "chevron-down"}
                boxSize={3}
              />
            }
          >
            {expandedIndexes.length ? "Collapse All" : "Expand All"}
          </Button>
          <Button
            size="sm"
            variant="outline-primary"
            w={{ base: "full", md: "auto" }}
            onClick={() => {
              trackUseViewJSON("Module Functions");
              const jsonString = JSON.stringify(fns, null, 2);
              const jsonWindow = window.open();
              if (jsonWindow) {
                // Modify styling later
                jsonWindow.document.write(
                  `<html><head><title>Module Exposed Function</title>`
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
            rightIcon={<CustomIcon name="launch" boxSize={3} />}
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
        updateExpandedIndexes={updateExpandedIndexes}
        moduleName={moduleName}
      />
      <FunctionAccordions
        address={address}
        expandedIndexes={expandedIndexes}
        fns={filteredViewFns}
        fnType={FunctionTypeTabIndex.VIEW}
        updateExpandedIndexes={updateExpandedIndexes}
        moduleName={moduleName}
      />
      <FunctionAccordions
        address={address}
        expandedIndexes={expandedIndexes}
        fns={filteredExecuteFns}
        fnType={FunctionTypeTabIndex.EXECUTE}
        updateExpandedIndexes={updateExpandedIndexes}
        moduleName={moduleName}
      />
    </Flex>
  );
};
