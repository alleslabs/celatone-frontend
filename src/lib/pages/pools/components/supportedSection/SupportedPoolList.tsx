import { SimpleGrid } from "@chakra-ui/react";

import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import type { Option, Pool } from "lib/types";

import { PoolCard } from "./PoolCard";

interface SupportedPoolListProps {
  isLoading: boolean;
  mode: string;
  pools: Option<Pool[]>;
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
    <SimpleGrid mt={4} spacing={4} columns={{ lg: 2, md: 1 }}>
      {pools.map((item) => (
        <PoolCard key={item.id} item={item} mode={mode} />
      ))}
    </SimpleGrid>
  );
};
