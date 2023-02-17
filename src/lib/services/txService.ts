import type {
  QueryFunctionContext,
  UseQueryResult,
} from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useChainId, useLCDEndpoint } from "lib/hooks";
import type { Option } from "lib/types";
import { formatStdFee } from "lib/utils";

import type { TxResponse } from "./tx";
import { queryTxData } from "./tx";

export interface TxData extends TxResponse {
  chainId: string;
  formattedFee: string;
}

export const useTxData = (txHash: Option<string>): UseQueryResult<TxData> => {
  const lcdEndpoint = useLCDEndpoint();
  const chainId = useChainId();
  const queryFn = useCallback(
    async ({ queryKey }: QueryFunctionContext) => {
      const txData = await queryTxData(
        queryKey.at(1) as string,
        queryKey.at(2) as string
      );
      return {
        ...txData,
        chainId,
        formattedFee: formatStdFee(txData.tx.value.fee),
      };
    },
    [chainId]
  );

  return useQuery({
    queryKey: ["tx_data", lcdEndpoint, txHash],
    queryFn,
    enabled: !!txHash,
    refetchOnWindowFocus: false,
  });
};
