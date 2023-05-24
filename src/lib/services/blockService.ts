import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useCelatoneApp, useChainId } from "lib/app-provider";
import {
  getLatestBlockInfoQueryDocument,
  getBlockDetailsByHeightQueryDocument,
  getBlockListQueryDocument,
  getBlockTimeQueryDocument,
} from "lib/query";
import type {
  BlockDetails,
  BlockInfo,
  BlockTimeInfo,
  LatestBlock,
  ValidatorAddr,
} from "lib/types";
import { parseDate, parseDateOpt, parseTxHash } from "lib/utils";

export const useBlocklistQuery = (
  limit: number,
  offset: number
): UseQueryResult<BlockInfo[]> => {
  const chainId = useChainId();
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = useCallback(
    async () =>
      indexerGraphClient
        .request(getBlockListQueryDocument, { limit, offset })
        .then(({ blocks }) =>
          blocks.map<BlockInfo>(
            ({
              hash,
              height,
              timestamp,
              transactions_aggregate,
              validator,
            }) => ({
              network: chainId,
              hash: parseTxHash(hash),
              height,
              timestamp: parseDate(timestamp),
              txCount: transactions_aggregate.aggregate?.count ?? 0,
              proposer: validator
                ? {
                    moniker: validator.moniker,
                    validatorAddress:
                      validator.operator_address as ValidatorAddr,
                  }
                : null,
            })
          )
        ),
    [indexerGraphClient, chainId, limit, offset]
  );

  return useQuery(["blocks", indexerGraphClient, limit, offset], queryFn);
};

export const useBlockCountQuery = (): UseQueryResult<number> => {
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = useCallback(
    async () =>
      indexerGraphClient
        .request(getLatestBlockInfoQueryDocument)
        .then(({ blocks }) => blocks[0]?.height ?? 0),
    [indexerGraphClient]
  );

  return useQuery(["block_count", indexerGraphClient], queryFn);
};

export const useBlockDetailsQuery = (
  height: number
): UseQueryResult<BlockDetails | null> => {
  const chainId = useChainId();
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = useCallback(
    async () =>
      indexerGraphClient
        .request(getBlockDetailsByHeightQueryDocument, { height })
        .then<BlockDetails | null>(({ blocks_by_pk }) =>
          blocks_by_pk
            ? {
                network: chainId,
                hash: parseTxHash(blocks_by_pk.hash),
                height: blocks_by_pk.height,
                timestamp: parseDate(blocks_by_pk.timestamp),
                gasUsed:
                  blocks_by_pk.transactions_aggregate.aggregate?.sum?.gas_used,
                gasLimit:
                  blocks_by_pk.transactions_aggregate.aggregate?.sum?.gas_limit,
                proposer: blocks_by_pk.validator
                  ? {
                      moniker: blocks_by_pk.validator.moniker,
                      validatorAddress: blocks_by_pk.validator
                        .operator_address as ValidatorAddr,
                    }
                  : null,
              }
            : null
        ),
    [indexerGraphClient, chainId, height]
  );

  return useQuery(["block_details", indexerGraphClient, height], queryFn, {
    keepPreviousData: true,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useLatestBlockInfo = (): UseQueryResult<LatestBlock> => {
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = useCallback(
    async () =>
      indexerGraphClient
        .request(getLatestBlockInfoQueryDocument)
        .then<LatestBlock>(({ blocks }) => ({
          height: blocks[0].height,
          timestamp: parseDateOpt(blocks[0].timestamp),
        })),
    [indexerGraphClient]
  );

  return useQuery(["latest_block_info", indexerGraphClient], queryFn);
};

export const useAverageBlockTime = (): UseQueryResult<BlockTimeInfo> => {
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = useCallback(
    async () =>
      indexerGraphClient
        .request(getBlockTimeQueryDocument)
        .then(({ hundred, latest }) => {
          return {
            hundred: parseDateOpt(hundred[0].timestamp),
            latest: parseDateOpt(latest[0].timestamp),
          };
        }),
    [indexerGraphClient]
  );

  return useQuery(["average_block_time", indexerGraphClient], queryFn);
};
