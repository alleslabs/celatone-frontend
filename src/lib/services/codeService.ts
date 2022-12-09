import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { indexerGraphClient } from "lib/data/graphql";
import {
  getCodeListByIDsQueryDocument,
  getCodeListByUserQueryDocument,
} from "lib/data/queries";
import type { CodeInfo } from "lib/types";

export const useCodeListByUserQuery = (
  walletAddr: string | undefined
): UseQueryResult<CodeInfo[] | undefined> => {
  const queryFn = useCallback(async () => {
    if (!walletAddr) return undefined;

    return indexerGraphClient
      .request(getCodeListByUserQueryDocument, {
        walletAddr,
      })
      .then(({ codes }) =>
        codes.map<CodeInfo>((code) => ({
          id: code.id,
          contracts: code.instantiated,
          uploader: code.account.uploader,
        }))
      );
  }, [walletAddr]);

  // TODO: add query key later
  return useQuery(["codes_by_user", walletAddr], queryFn, {
    keepPreviousData: true,
    enabled: !!walletAddr,
  });
};

export const useCodeListByIDsQuery = (ids: number[] | undefined) => {
  const queryFn = useCallback(async () => {
    if (!ids) return undefined;

    return indexerGraphClient
      .request(getCodeListByIDsQueryDocument, {
        ids,
      })
      .then(({ codes }) =>
        codes.map<CodeInfo>((code) => ({
          id: code.id,
          uploader: code.account.uploader,
          contracts: code.instantiated,
        }))
      );
  }, [ids]);

  // TODO: add query key later
  return useQuery(["codes_by_ids", ids], queryFn, {
    keepPreviousData: true,
    enabled: !!ids,
  });
};
