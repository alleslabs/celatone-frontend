import { Accordion, SimpleGrid } from "@chakra-ui/react";

import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import type { Option, Pool } from "lib/types";

import { UnsupportedPoolCard } from "./UnsupportedPoolCard";

interface UnsupportedPoolListProps {
  pools: Option<Pool[]>;
  isLoading: boolean;
  expandedIndex: number[];
  updateExpandedIndex: (index: number[]) => void;
}

export const UnsupportedPoolList = ({
  pools,
  isLoading,
  expandedIndex,
  updateExpandedIndex,
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
        index={expandedIndex}
        onChange={updateExpandedIndex}
      >
        {pools.map((item) => (
          <UnsupportedPoolCard key={item.id} item={item} poolId={item.id} />
        ))}
      </Accordion>
    </SimpleGrid>
  );
};
