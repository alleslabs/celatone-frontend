import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";

import { useEndpoint } from "lib/hooks";
import { queryData } from "lib/services/contract";
import type { ContractAddr, RpcQueryError } from "lib/types";

interface UseQueryCmdsProps {
  contractAddress: string;
}
export const useQueryCmds = ({ contractAddress }: UseQueryCmdsProps) => {
  const [queryCmds, setQueryCmds] = useState<[string, string][]>([]);
  const endpoint = useEndpoint();

  const { isFetching } = useQuery(
    ["query", "cmds", endpoint, contractAddress, '{"": {}}'],
    async () =>
      queryData(endpoint, contractAddress as ContractAddr, '{"": {}}'),
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
