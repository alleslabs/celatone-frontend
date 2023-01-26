import { useWallet } from "@cosmos-kit/react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback } from "react";

import { CELATONE_API_ENDPOINT, getChainApiPath, getMainnetApiPath } from "env";
import type {
  Contract,
  Option,
  PublicInfo,
  PublicProjectInfo,
  RawContract,
  RawPublicProjectInfo,
} from "lib/types";

const parseContract = (raw: RawContract): Contract => ({
  contractAddress: raw.address,
  description: raw.description,
  name: raw.name,
  slug: raw.slug,
});

export const usePublicProjects = () => {
  const { currentChainRecord } = useWallet();

  const queryFn = useCallback(async () => {
    // eslint-disable-next-line sonarjs/no-duplicate-string
    if (!currentChainRecord) throw new Error("No chain selected");

    return axios
      .get<RawPublicProjectInfo[]>(
        `${CELATONE_API_ENDPOINT}/projects/${getChainApiPath(
          currentChainRecord.chain.chain_name
        )}/${getMainnetApiPath(currentChainRecord.chain.chain_id)}`
      )
      .then(({ data: projects }) =>
        projects.map<PublicProjectInfo>((project) => ({
          ...project,
          contracts: project.contracts.map(parseContract),
        }))
      );
  }, [currentChainRecord]);

  return useQuery(["public_project"], queryFn, {
    keepPreviousData: true,
  });
};

export const usePublicProjectBySlug = (slug: Option<string>) => {
  const { currentChainRecord } = useWallet();
  const queryFn = useCallback(async (): Promise<Option<PublicProjectInfo>> => {
    if (!slug) throw new Error("No project selected");
    if (!currentChainRecord) throw new Error("No chain selected");
    return axios
      .get<RawPublicProjectInfo>(
        `${CELATONE_API_ENDPOINT}/projects/${getChainApiPath(
          currentChainRecord.chain.chain_name
        )}/${getMainnetApiPath(currentChainRecord.chain.chain_id)}/${slug}`
      )
      .then(({ data: project }) => ({
        ...project,
        contracts: project.contracts.map(parseContract),
      }));
  }, [currentChainRecord, slug]);

  return useQuery(["public_project_by_slug"], queryFn, {
    keepPreviousData: true,
    enabled: !!slug,
  });
};

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
