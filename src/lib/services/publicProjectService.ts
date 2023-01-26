import { useWallet } from "@cosmos-kit/react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback } from "react";

import { CELATONE_API_ENDPOINT, getChainApiPath } from "env";
import type { Option, PublicInfo } from "lib/types";

export const usePublicProjectByContractAddress = (
  contractAddress: Option<string>
): UseQueryResult<PublicInfo> => {
  const { currentChainRecord } = useWallet();
  const queryFn = useCallback(async () => {
    if (!contractAddress) throw new Error("Contract address not found");
    if (!currentChainRecord) throw new Error("No chain selected");
    return axios
      .get<PublicInfo>(
        `${CELATONE_API_ENDPOINT}/contracts/${getChainApiPath(
          currentChainRecord.chain.chain_name
        )}/${currentChainRecord.chain.chain_id}/${contractAddress}`
      )
      .then(({ data: projectInfo }) => projectInfo);
  }, [contractAddress, currentChainRecord]);

  return useQuery(["public_project_by_contract_address"], queryFn, {
    keepPreviousData: true,
    enabled: !!contractAddress,
  });
};
