import type { IndexedModule } from "lib/types";

import { Accordion, Button, Flex, Heading } from "@chakra-ui/react";
import { trackUseExpandAll, trackUseViewJSON } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { StructCard } from "lib/components/module/StructCard";
import { EmptyState } from "lib/components/state";
import { useMemo, useState } from "react";

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
        alignItems={{ base: "flex-start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        gap={{ base: 4, md: 0 }}
        justifyContent="space-between"
        maxH={{ md: "24px" }}
      >
        <Heading as="h6" fontWeight={600} variant="h6">
          Structs
        </Heading>
        <Flex
          alignItems="center"
          gap={{ base: 2, md: 4 }}
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
            w="full"
            onClick={() => {
              trackUseExpandAll(
                expandedIndexes.length ? "collapse" : "expand",
                "Module struct"
              );
              setExpandedIndexes((prev) =>
                !prev.length ? Array.from(Array(structs.length).keys()) : []
              );
            }}
          >
            {expandedIndexes.length ? "Collapse all" : "Expand all"}
          </Button>
          <Button
            rightIcon={<CustomIcon name="launch" />}
            size="sm"
            variant="outline-primary"
            w="full"
            onClick={() => {
              trackUseViewJSON("Module struct");
              const jsonString = JSON.stringify(structs, null, 2);
              const jsonWindow = window.open();
              if (jsonWindow) {
                // Modify styling later
                jsonWindow.document.write(
                  `<html><head><title>Module structs</title>`
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
        amptrackSection="module-struct-search"
        placeholder="Search with struct name"
        size={{ base: "md", md: "lg" }}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <Accordion
        allowMultiple
        index={expandedIndexes}
        mt={4}
        onChange={updateExpandedIndexes}
      >
        {filteredStructs.length ? (
          <Flex direction="column" gap={4}>
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
