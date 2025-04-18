import type { ChainConfig } from "@alleslabs/shared";

import { TierMap } from "lib/types";

export const createQueryFnWithTimeout =
  <T>(queryFn: () => Promise<T>, ms: number = 6 * 1000) =>
  () =>
    Promise.race([
      queryFn(),
      new Promise<T>((_, reject) => {
        setTimeout(
          () =>
            reject(
              new Error(
                `Failed to receive query response in ${ms} milliseconds`
              )
            ),
          ms
        );
      }),
    ]);

const callQueryFn = async <T>(
  tier: ChainConfig["tier"],
  queryFn?: () => Promise<T>
) => {
  if (!queryFn) {
    throw new Error(`Query function is not provided on tier ${tier}`);
  }
  return queryFn();
};

export const handleQueryByTier = async <R>({
  queryFull,
  queryLite,
  queryMesa,
  querySequencer,
  threshold = "lite",
  tier,
}: {
  tier: ChainConfig["tier"];
  threshold: ChainConfig["tier"];
  queryLite?: () => Promise<R>;
  queryMesa?: () => Promise<R>;
  querySequencer?: () => Promise<R>;
  queryFull?: () => Promise<R>;
}): Promise<R> => {
  const tierValue = TierMap[tier];
  const thresholdValue = TierMap[threshold];

  if (tierValue < thresholdValue) {
    throw new Error(
      `Tier ${tier} does not meet the required threshold tier ${threshold}`
    );
  }

  switch (tier) {
    case "lite":
      return callQueryFn("lite", queryLite);
    case "mesa":
      return callQueryFn("mesa", queryMesa);
    case "sequencer":
      return callQueryFn("sequencer", querySequencer);
    case "full":
      return callQueryFn("full", queryFull);
    default:
      throw new Error(`Unsupported tier: ${tier}`);
  }
};

export const queryWithArchivalFallback = async <T>(
  endpoint: string,
  fetch: (endpoint: string) => Promise<T>
) => {
  try {
    return await fetch(endpoint);
  } catch (error) {
    if (endpoint.includes("anvil")) {
      return fetch(endpoint.replace("rest-", "archival-rest-"));
    }
    throw error;
  }
};
