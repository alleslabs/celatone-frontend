import type { DockerImageTagResult } from "lib/services/types/docker-image";
import type { Option } from "lib/types";

import { useDockerImageTag } from "lib/services/docker-image";
import { useMemo } from "react";

const mapOptimizerData = (
  data: Option<DockerImageTagResult[]>,
  prefix: string
) =>
  data?.map((result) => ({
    label: `${prefix}:${result.name}`,
    value: `${prefix}:${result.name}`,
    version: result.name,
    lastUpdated: result.lastUpdated,
  })) ?? [];

export const useWasmOptimizerVersions = () => {
  const { data: optimizer } = useDockerImageTag("cosmwasm", "optimizer");
  const { data: rustOptimizer } = useDockerImageTag(
    "cosmwasm",
    "rust-optimizer"
  );

  return useMemo(() => {
    const optimizerResult = mapOptimizerData(optimizer, "cosmwasm/optimizer");
    const rustOptimizerResult = mapOptimizerData(
      rustOptimizer,
      "cosmwasm/rust-optimizer"
    );

    const results = [...optimizerResult, ...rustOptimizerResult];

    return results.sort((a, b) => {
      if (a.version === b.version)
        return a.label.startsWith("cosmwasm/optimizer:") ? -1 : 1;
      return b.lastUpdated.getTime() - a.lastUpdated.getTime();
    });
  }, [optimizer, rustOptimizer]);
};
