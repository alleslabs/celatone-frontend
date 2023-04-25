import { Accordion, SimpleGrid } from "@chakra-ui/react";

import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import type { Option, Pool } from "lib/types";

import { UnsupportedPoolCard } from "./UnsupportedPoolCard";

interface UnsupportedPoolListProps {
  pools: Option<Pool[]>;
  isLoading: boolean;
  expandedIndexes: number[];
  updateExpandedIndexes: (index: number[]) => void;
}

export const UnsupportedPoolList = ({
  pools,
  isLoading,
  expandedIndexes,
  updateExpandedIndexes,
}: UnsupportedPoolListProps) => {
  if (isLoading) return <Loading />;
  if (!pools?.length)
    return (
      <EmptyState
        imageVariant="empty"
        message="No unsupported pool found."
        withBorder
      />
    );

  return (
    <SimpleGrid columns={1} spacing={4} w="full">
      <Accordion
        allowMultiple
        index={expandedIndexes}
        onChange={updateExpandedIndexes}
      >
        {pools.map((item) => (
          <UnsupportedPoolCard key={item.id} item={item} />
        ))}
      </Accordion>
    </SimpleGrid>
  );
};
