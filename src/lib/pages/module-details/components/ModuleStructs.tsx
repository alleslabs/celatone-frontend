import { Accordion, Button, Flex, Heading } from "@chakra-ui/react";
import { useMemo, useState } from "react";

import { trackUseExpandAll, trackUseViewJSON } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { StructCard } from "lib/components/module/StructCard";
import type { IndexedModule } from "lib/types";

interface ModuleStructsProps {
  structs: IndexedModule["parsedAbi"]["structs"];
}

export const ModuleStructs = ({ structs }: ModuleStructsProps) => {
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);
  const [keyword, setKeyword] = useState("");

  const filteredStructs = useMemo(() => {
    if (!keyword) return structs;
    return structs.filter((struct) =>
      struct.name.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [keyword, structs]);

  const updateExpandedIndexes = (indexes: number[]) =>
    setExpandedIndexes(indexes);

  return (
    <Flex direction="column" gap={4}>
      <Flex
        maxH={{ md: "24px" }}
        justifyContent="space-between"
        alignItems={{ base: "flex-start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        gap={{ base: 4, md: 0 }}
      >
        <Heading as="h6" variant="h6" fontWeight={600}>
          Structs
        </Heading>
        <Flex
          gap={{ base: 2, md: 4 }}
          alignItems="center"
          w={{ base: "full", md: "auto" }}
        >
          <Button
            variant="outline-primary"
            w="full"
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
                "Module Struct"
              );
              setExpandedIndexes((prev) =>
                !prev.length ? Array.from(Array(structs.length).keys()) : []
              );
            }}
          >
            {expandedIndexes.length ? "Collapse All" : "Expand All"}
          </Button>
          <Button
            variant="outline-primary"
            w="full"
            size="sm"
            rightIcon={<CustomIcon name="launch" />}
            onClick={() => {
              trackUseViewJSON("Module Struct");
              const jsonString = JSON.stringify(structs, null, 2);
              const jsonWindow = window.open();
              if (jsonWindow) {
                // Modify styling later
                jsonWindow.document.write(
                  `<html><head><title>Module Structs</title>`
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
        placeholder="Search with Struct Name"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        size={{ base: "md", md: "lg" }}
        amptrackSection="module-struct-search"
      />
      <Accordion
        mt={4}
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
