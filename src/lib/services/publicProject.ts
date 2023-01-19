import { useWallet } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback } from "react";

import { CELATONE_API_ENDPOINT, getChainApiPath, getMainnetApiPath } from "env";
import type { AssetInfo, Option } from "lib/types";
import type {
  Account,
  Code,
  Detail,
  RawContract,
  RawPublicProjectInfo,
} from "lib/types/projects";

export interface Contract extends Omit<RawContract, "address"> {
  contractAddress: string;
}

export interface PublicProjectInfo {
  accounts: Account[];
  assets: AssetInfo;
  codes: Code[];
  contracts: Contract[];
  details: Detail;
  slug: string;
}

const parseContract = (raw: RawContract): Contract => ({
  contractAddress: raw.address,
  description: raw.description,
  name: raw.name,
  slug: raw.slug,
});

export const usePublicProjectsQuery = () => {
  const { currentChainRecord } = useWallet();

  const queryFn = useCallback(async () => {
    if (!currentChainRecord) return undefined;

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
    if (!slug) return undefined;
    if (!currentChainRecord) return undefined;
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
