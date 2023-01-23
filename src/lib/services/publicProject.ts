import { useWallet } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback } from "react";

import { CELATONE_API_ENDPOINT, getChainApiPath, getMainnetApiPath } from "env";
import type {
  Option,
  RawContract,
  RawPublicProjectInfo,
  PublicProjectInfo,
  Contract,
} from "lib/types";

const parseContract = (raw: RawContract): Contract => ({
  contractAddress: raw.address,
  description: raw.description,
  name: raw.name,
  slug: raw.slug,
});

export const usePublicProjectsQuery = () => {
  const { currentChainRecord } = useWallet();

  const queryFn = useCallback(async () => {
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

export const usePublicProjectBySlugQuery = (slug: Option<string>) => {
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
