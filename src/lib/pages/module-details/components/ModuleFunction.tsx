import { Flex, Heading, Button, Accordion } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { Loading } from "lib/components/Loading";
import { FunctionDetailCard } from "lib/components/module/FunctionDetailCard";
import type { IndexedModule } from "lib/services/moduleService";
import { getFirstQueryParam } from "lib/utils";

import { FunctionTypeSwitch, FunctionTypeTabs } from "./FunctionTypeSwitch";

interface ModuleFunctionProps {
  moduleData: IndexedModule;
}

export const ModuleFunction = ({ moduleData }: ModuleFunctionProps) => {
  const router = useRouter();
  const navigate = useInternalNavigate();

  const tab = getFirstQueryParam(router.query.type) as FunctionTypeTabs;
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);
  const [keyword, setKeyword] = useState("");

  const exposedFns = moduleData.parsedAbi.exposed_functions;

  const searchedFns = useMemo(() => {
    if (!keyword) return exposedFns;
    return exposedFns.filter((fn) => fn.name?.includes(keyword));
  }, [keyword, exposedFns]);
  const viewFns = searchedFns.filter((fn) => fn.is_view);
  const executeFns = searchedFns.filter((fn) => !fn.is_view);

  const getDisplayedFns = (selectedTab: FunctionTypeTabs) => {
    if (selectedTab === FunctionTypeTabs.VIEW) return viewFns;
    if (selectedTab === FunctionTypeTabs.EXECUTE) return executeFns;
    return searchedFns;
  };

  const updateExpandedIndexes = (indexes: number[]) =>
    setExpandedIndexes(indexes);

  const handleTabChange = useCallback(
    (nextTab: FunctionTypeTabs) => {
      if (nextTab === tab) return;
      navigate({
        pathname: `/modules/[address]/[moduleName]/function`,
        query: {
          address: moduleData.address,
          moduleName: moduleData.moduleName,
          type: nextTab,
        },
        options: {
          shallow: true,
        },
      });
    },
    [tab, moduleData.address, moduleData.moduleName, navigate]
  );

  if (!moduleData) return <Loading />;

  return (
    <Flex direction="column" gap={8}>
      <Heading as="h6" variant="h6" fontWeight={600} minH="24px">
        Exposed Function
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
          counts={[searchedFns.length, viewFns.length, executeFns.length]}
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
                !prev.length
                  ? Array.from(
                      Array(
                        moduleData.parsedAbi.exposed_functions.length
                      ).keys()
                    )
                  : []
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
              const jsonString = JSON.stringify(
                moduleData.parsedAbi.exposed_functions,
                null,
                2
              );
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
      <Accordion
        allowMultiple
        index={expandedIndexes}
        onChange={updateExpandedIndexes}
      >
        <Flex direction="column" gap={4}>
          {getDisplayedFns(tab).map((fn) => (
            <FunctionDetailCard exposedFn={fn} key={fn.name} />
          ))}
        </Flex>
      </Accordion>
    </Flex>
  );
};
