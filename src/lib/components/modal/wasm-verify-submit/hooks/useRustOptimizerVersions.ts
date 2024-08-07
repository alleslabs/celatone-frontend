import { useMemo } from "react";

import { useDockerImageTag } from "lib/services/docker-image";

export const useRustOptimizerVersions = () => {
  const { data: rustOptimizer } = useDockerImageTag(
    "cosmwasm",
    "rust-optimizer"
  );
  const { data: rustOptimizerArm64 } = useDockerImageTag(
    "cosmwasm",
    "rust-optimizer-arm64"
  );

  return useMemo(() => {
    const rustOptimizerResult =
      rustOptimizer?.results.map((result) => ({
        label: `cosmwasm/rust-optimizer:${result.name}`,
        value: `cosmwasm/rust-optimizer:${result.name}`,
        version: result.name,
        lastUpdated: result.lastUpdated,
      })) ?? [];
    const rustOptimizerArm64Result =
      rustOptimizerArm64?.results.map((result) => ({
        label: `cosmwasm/rust-optimizer-arm64:${result.name}`,
        value: `cosmwasm/rust-optimizer-arm64:${result.name}`,
        version: result.name,
        lastUpdated: result.lastUpdated,
      })) ?? [];

    const results = [...rustOptimizerResult, ...rustOptimizerArm64Result];

    return results.sort((a, b) => {
      if (a.version === b.version)
        return a.label.startsWith("cosmwasm/optimizer:") ? -1 : 1;
      return b.lastUpdated.getTime() - a.lastUpdated.getTime();
    });
  }, [rustOptimizer, rustOptimizerArm64]);
};
