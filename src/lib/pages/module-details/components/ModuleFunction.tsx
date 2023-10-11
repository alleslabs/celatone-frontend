import { Flex, Heading, Button, Accordion } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { FunctionDetailCard } from "lib/components/module/FunctionDetailCard";
import { EmptyState } from "lib/components/state";
import type { IndexedModule } from "lib/services/moduleService";
import type { ExposedFunction } from "lib/types";
import { getFirstQueryParam } from "lib/utils";

import { FunctionTypeSwitch, FunctionTypeTabs } from "./FunctionTypeSwitch";

interface ModuleFunctionProps {
  address: IndexedModule["address"];
  moduleName: IndexedModule["moduleName"];
  fns: IndexedModule["parsedAbi"]["exposed_functions"];
  viewFns: IndexedModule["viewFunctions"];
  executeFns: IndexedModule["executeFunctions"];
}

const FunctionAccordions = ({
  address,
  moduleName,
  type,
  fns,
  expandedIndexes,
  updateExpandedIndexes,
}: {
  address: IndexedModule["address"];
  moduleName: IndexedModule["moduleName"];
  type: FunctionTypeTabs;
  fns: ExposedFunction[];
  expandedIndexes: number[];
  updateExpandedIndexes: (indexes: number[]) => void;
}) => (
  <Flex id={type} display="none">
    {fns.length ? (
      <Accordion
        allowMultiple
        index={expandedIndexes}
        onChange={updateExpandedIndexes}
      >
        <Flex direction="column" gap={4}>
          {fns.map((fn) => (
            <FunctionDetailCard
              exposedFn={fn}
              key={fn.name}
              address={address}
              moduleName={moduleName}
            />
          ))}
        </Flex>
      </Accordion>
    ) : (
      <EmptyState
        imageVariant="empty"
        message={"This module doesn't contain any execute functions."}
      />
    )}
  </Flex>
);

export const ModuleFunction = ({
  address,
  moduleName,
  fns,
  viewFns,
  executeFns,
}: ModuleFunctionProps) => {
  const router = useRouter();
  const navigate = useInternalNavigate();

  const tab = getFirstQueryParam(router.query.type) as FunctionTypeTabs;
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);
  const [keyword, setKeyword] = useState("");

  const [filteredFns, filteredViewFns, filteredExecuteFns] = useMemo(() => {
    if (!keyword) return [fns, viewFns, executeFns];
    return [
      fns.filter((fn) => fn.name.includes(keyword)),
      viewFns.filter((fn) => fn.name.includes(keyword)),
      executeFns.filter((fn) => fn.name.includes(keyword)),
    ];
  }, [executeFns, fns, keyword, viewFns]);

  const updateExpandedIndexes = (indexes: number[]) =>
    setExpandedIndexes(indexes);

  const handleTabChange = useCallback(
    (nextTab: FunctionTypeTabs) => {
      if (nextTab === tab) return;
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
    [address, moduleName, navigate, tab]
  );

  return (
    <Flex
      direction="column"
      gap={8}
      sx={{ [`& #${tab}`]: { display: "block" } }}
    >
      <Heading as="h6" variant="h6" fontWeight={600} minH="24px">
        Exposed Functions
      </Heading>
      <InputWithIcon
        placeholder="Search functions..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        action="exposed-function-search"
      />
      <Flex justifyContent="space-between" alignItems="center">
        <FunctionTypeSwitch
          currentTab={tab}
          onTabChange={handleTabChange}
          my={3}
          counts={[
            filteredFns.length,
            filteredViewFns.length,
            filteredExecuteFns.length,
          ]}
        />
        <Flex gap={4} alignItems="center">
          <Button
            variant="outline-primary"
            size="sm"
            rightIcon={
              <CustomIcon
                name={expandedIndexes.length ? "chevron-up" : "chevron-down"}
                boxSize={3}
              />
            }
            onClick={() => {
              setExpandedIndexes((prev) =>
                !prev.length ? Array.from(Array(fns.length).keys()) : []
              );
            }}
          >
            {expandedIndexes.length ? "Collapse All" : "Expand All"}
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            rightIcon={<CustomIcon name="launch" />}
            onClick={() => {
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
          >
            View in JSON
          </Button>
        </Flex>
      </Flex>
      {/* rendering all tabs at once and use css selector to avoid lagginess when changing tab */}
      <FunctionAccordions
        type={FunctionTypeTabs.ALL}
        fns={filteredFns}
        expandedIndexes={expandedIndexes}
        updateExpandedIndexes={updateExpandedIndexes}
        address={address}
        moduleName={moduleName}
      />
      <FunctionAccordions
        type={FunctionTypeTabs.VIEW}
        fns={filteredViewFns}
        expandedIndexes={expandedIndexes}
        updateExpandedIndexes={updateExpandedIndexes}
        address={address}
        moduleName={moduleName}
      />
      <FunctionAccordions
        type={FunctionTypeTabs.EXECUTE}
        fns={filteredExecuteFns}
        expandedIndexes={expandedIndexes}
        updateExpandedIndexes={updateExpandedIndexes}
        address={address}
        moduleName={moduleName}
      />
    </Flex>
  );
};
