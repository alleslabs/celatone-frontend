import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";

import { useLCDEndpoint } from "lib/app-provider";
import { queryData } from "lib/services/contract";
import type { ContractAddr, RpcQueryError } from "lib/types";

export const useQueryCmds = (contractAddress: ContractAddr) => {
  const [queryCmds, setQueryCmds] = useState<[string, string][]>([]);
  const lcdEndpoint = useLCDEndpoint();

  const { isFetching } = useQuery(
    ["query", "cmds", lcdEndpoint, contractAddress, '{"": {}}'],
    async () =>
      queryData(lcdEndpoint, contractAddress as ContractAddr, '{"": {}}'),
    {
      enabled: !!contractAddress,
      retry: false,
      cacheTime: 0,
      refetchOnWindowFocus: false,
      onError: (e: AxiosError<RpcQueryError>) => {
        const cmds: string[] = [];
        Array.from(e.response?.data.message?.matchAll(/`(.*?)`/g) || [])
          .slice(1)
          .forEach((match) => cmds.push(match[1]));
        setQueryCmds(cmds.map((cmd) => [cmd, `{"${cmd}": {}}`]));
      },
    }
  );
  return { isFetching, queryCmds };
};
