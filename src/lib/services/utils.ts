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
  querySequencer,
  threshold = "lite",
  tier,
}: {
  queryFull?: () => Promise<R>;
  queryLite?: () => Promise<R>;
  querySequencer?: () => Promise<R>;
  threshold: ChainConfig["tier"];
  tier: ChainConfig["tier"];
}): Promise<R> => {
  const tierValue = TierMap[tier];
  const thresholdValue = TierMap[threshold];

  if (tierValue < thresholdValue) {
    throw new Error(
      `Tier ${tier} does not meet the required threshold tier ${threshold}`
    );
  }

  switch (tier) {
    case "full":
      return callQueryFn("full", queryFull);
    case "lite":
      return callQueryFn("lite", queryLite);
    case "sequencer":
      return callQueryFn("sequencer", querySequencer);
    default:
      throw new Error(`Unsupported tier: ${tier}`);
  }
};

export const getArchivalEndpoint = <T>(
  endpoint: string,
  defaultEndpoint: T
) => {
  if (!endpoint.includes("anvil") || endpoint.includes("archival-"))
    return defaultEndpoint;

  if (endpoint.includes("jsonrpc-")) {
    return endpoint.replace("jsonrpc-", "archival-jsonrpc-");
  }

  if (endpoint.includes("rest-")) {
    return endpoint.replace("rest-", "archival-rest-");
  }

  return defaultEndpoint;
};

export const queryWithArchivalFallback = async <T>(
  endpoint: string,
  fetch: (endpoint: string, throwErrorIfNoData: boolean) => Promise<T>
): Promise<T> => {
  const archivalEndpoint = getArchivalEndpoint(endpoint, null);

  try {
    // Try main endpoint first
    return await fetch(endpoint, true);
  } catch (err) {
    if (!archivalEndpoint) {
      throw err;
    }

    // Try archival endpoint second
    const archivalData = await fetch(archivalEndpoint, false);
    if (archivalData === null) {
      throw new Error("No data found");
    }

    return archivalData;
  }
};

export const getIpfsUrl = (uri: string) => {
  if (uri.startsWith("ipfs://")) {
    return `https://ipfs.io/ipfs/${uri.slice(7)}`;
  }
  return uri;
};
