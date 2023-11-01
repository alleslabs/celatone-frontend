import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";

import { CELATONE_QUERY_KEYS, useBaseApiRoute } from "lib/app-provider";
import { queryData } from "lib/services/contract";
import type { ContractAddr, RpcQueryError } from "lib/types";

export const useQueryCmds = (contractAddress: ContractAddr) => {
  const [queryCmds, setQueryCmds] = useState<[string, string][]>([]);
  const lcdEndpoint = useBaseApiRoute("rest");

  const { isFetching } = useQuery(
    [
      CELATONE_QUERY_KEYS.CONTRACT_QUERY_CMDS,
      lcdEndpoint,
      contractAddress,
      '{"": {}}',
    ],
    async () => {
      if (!contractAddress) return [];
      return queryData(
        lcdEndpoint,
        contractAddress as ContractAddr,
        '{"": {}}'
      );
    },
    {
      enabled: !!contractAddress,
      retry: false,
      cacheTime: 0,
      refetchOnWindowFocus: false,
      onError: (e: AxiosError<RpcQueryError>) => {
        const cmds: string[] = [];
        const resMsg = e.response?.data.message;

        // Check if Sylvia framework
        const sylviaRegex =
          /Messages supported by this contract: (.*?): query wasm contract failed: invalid request/;
        const contentMatch = resMsg?.match(sylviaRegex);

        if (contentMatch && contentMatch[1]) {
          const content = contentMatch[1].split(",");
          content.forEach((each) => cmds.push(each.trim()));
        } else {
          Array.from(resMsg?.matchAll(/`(.*?)`/g) || [])
            .slice(1)
            .forEach((match) => cmds.push(match[1]));
        }
        setQueryCmds(cmds.map((cmd) => [cmd, `{"${cmd}": {}}`]));
      },
    }
  );
  return { isFetching, queryCmds };
};
