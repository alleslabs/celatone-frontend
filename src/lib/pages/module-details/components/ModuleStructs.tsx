import { Accordion, Button, Flex, Heading } from "@chakra-ui/react";
import { useMemo, useState } from "react";

import { trackUseExpandAll, trackUseViewJSON } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { StructCard } from "lib/components/module/StructCard";
import { EmptyState } from "lib/components/state";
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
    <Flex gap={4} direction="column">
      <Flex
        alignItems={{ base: "flex-start", md: "center" }}
        gap={{ base: 4, md: 0 }}
        maxH={{ md: "24px" }}
        direction={{ base: "column", md: "row" }}
        justifyContent="space-between"
      >
        <Heading as="h6" variant="h6" fontWeight={600}>
          Structs
        </Heading>
        <Flex
          alignItems="center"
          gap={{ base: 2, md: 4 }}
          w={{ base: "full", md: "auto" }}
        >
          <Button
            size="sm"
            variant="outline-primary"
            w="full"
            onClick={() => {
              trackUseExpandAll(
                expandedIndexes.length ? "collapse" : "expand",
                "Module Struct"
              );
              setExpandedIndexes((prev) =>
                !prev.length ? Array.from(Array(structs.length).keys()) : []
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
            w="full"
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
            rightIcon={<CustomIcon name="launch" />}
          >
            View in JSON
          </Button>
        </Flex>
      </Flex>
      <InputWithIcon
        size={{ base: "md", md: "lg" }}
        value={keyword}
        amptrackSection="module-struct-search"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search with Struct Name"
      />
      <Accordion
        index={expandedIndexes}
        mt={4}
        allowMultiple
        onChange={updateExpandedIndexes}
      >
        {filteredStructs.length ? (
          <Flex gap={4} direction="column">
            {filteredStructs.map((item) => (
              <StructCard key={item.name} struct={item} />
            ))}
          </Flex>
        ) : (
          <EmptyState
            imageVariant="not-found"
            message="No structs match your search keyword."
            my={0}
            withBorder
          />
        )}
      </Accordion>
    </Flex>
  );
};
