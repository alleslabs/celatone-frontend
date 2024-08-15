import { useMemo } from "react";

import { useDockerImageTag } from "lib/services/docker-image";

export const useWasmOptimizerVersions = () => {
  const { data: optimizer } = useDockerImageTag("cosmwasm", "optimizer");
  const { data: rustOptimizer } = useDockerImageTag(
    "cosmwasm",
    "rust-optimizer"
  );

  return useMemo(() => {
    const optimizerResult =
      optimizer?.map((result) => ({
        label: `cosmwasm/optimizer:${result.name}`,
        value: `cosmwasm/optimizer:${result.name}`,
        version: result.name,
        lastUpdated: result.lastUpdated,
      })) ?? [];
    const rustOptimizerResult =
      rustOptimizer?.map((result) => ({
        label: `cosmwasm/rust-optimizer:${result.name}`,
        value: `cosmwasm/rust-optimizer:${result.name}`,
        version: result.name,
        lastUpdated: result.lastUpdated,
      })) ?? [];

    const results = [...optimizerResult, ...rustOptimizerResult];

    return results.sort((a, b) => {
      if (a.version === b.version)
        return a.label.startsWith("cosmwasm/optimizer:") ? -1 : 1;
      return b.lastUpdated.getTime() - a.lastUpdated.getTime();
    });
  }, [optimizer, rustOptimizer]);
};
