import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { indexerGraphClient } from "lib/data/graphql";
import {
  getCodeInfoFromCodeId,
  getCodeListByIDsQueryDocument,
  getCodeListByUserQueryDocument,
} from "lib/data/queries";
import type { CodeInfo, CodeInfoInCodeDetail } from "lib/types";
import { parseTxHash } from "lib/utils";

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

export const useCodeInfoByCodeId = (
  codeId: number | undefined
): UseQueryResult<CodeInfoInCodeDetail | undefined> => {
  const queryFn = useCallback(async () => {
    if (!codeId) return undefined;

    return indexerGraphClient
      .request(getCodeInfoFromCodeId, {
        codeId,
      })
      .then(({ codes }) => {
        const code = codes[0];
        return {
          codeId: code.id,
          uploader: code.account.address,
          hash:
            (code.transaction && parseTxHash(code.transaction?.hash)) ??
            undefined,
          height: code.transaction?.block.height,
          created:
            (code.transaction?.block &&
              new Date(`${code.transaction?.block?.timestamp}Z`)) ??
            undefined,
          proposalId: code.code_proposals[0]?.proposal_id,
          permissionAddress: code.access_config_addresses,
          instantiatePermission: code.access_config_permission,
        };
      });
  }, [codeId]);
  return useQuery(["code_info_by_id", codeId], queryFn, {
    keepPreviousData: true,
    enabled: !!codeId,
  });
};
