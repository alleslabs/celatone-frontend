import type { Option, Pool } from "lib/types";

import { SimpleGrid } from "@chakra-ui/react";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";

import { PoolCard } from "./PoolCard";

interface SupportedPoolListProps {
  pools: Option<Pool[]>;
  isLoading: boolean;
  mode: string;
}

export const SupportedPoolList = ({
  isLoading,
  mode,
  pools,
}: SupportedPoolListProps) => {
  if (isLoading) return <Loading />;
  if (!pools?.length)
    return (
      <EmptyState
        imageVariant="empty"
        message="No supported pool found."
        withBorder
      />
    );

  return (
    <SimpleGrid columns={{ lg: 2, md: 1 }} mt={4} spacing={4}>
      {pools.map((item) => (
        <PoolCard key={item.id} item={item} mode={mode} />
      ))}
    </SimpleGrid>
  );
};
