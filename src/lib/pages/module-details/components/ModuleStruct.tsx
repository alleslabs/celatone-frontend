import { Button, Flex, Heading, Accordion } from "@chakra-ui/react";
import { useMemo, useState } from "react";

import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { Loading } from "lib/components/Loading";
import { StructCard } from "lib/components/module/StructCard";
import { AmpTrackExpandAll } from "lib/services/amplitude";
import type { IndexedModule } from "lib/services/moduleService";

interface ModuleStructProps {
  moduleData: IndexedModule;
}
export const ModuleStruct = ({ moduleData }: ModuleStructProps) => {
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);
  const [keyword, setKeyword] = useState("");

  const moduleStructs = moduleData.parsedAbi.structs;
  const filteredStructs = useMemo(() => {
    if (!keyword) return moduleStructs;
    return moduleStructs.filter((struct) => struct.name?.includes(keyword));
  }, [keyword, moduleStructs]);

  const updateExpandedIndexes = (indexes: number[]) =>
    setExpandedIndexes(indexes);
  if (!moduleData) return <Loading />;
  return (
    <Flex direction="column" gap={8}>
      <Flex maxH="24px" justifyContent="space-between" alignItems="center">
        <Heading as="h6" variant="h6" fontWeight={600}>
          Structs
        </Heading>
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
              AmpTrackExpandAll(expandedIndexes.length ? "collapse" : "expand");
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
      <InputWithIcon
        placeholder="Search structs..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        action="module-struct-search"
      />
      <Accordion
        allowMultiple
        index={expandedIndexes}
        onChange={updateExpandedIndexes}
      >
        <Flex direction="column" gap={4}>
          {filteredStructs.map((item) => (
            <StructCard struct={item} key={item.name} />
          ))}
        </Flex>
      </Accordion>
    </Flex>
  );
};
