import { useWallet } from "@cosmos-kit/react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback } from "react";

import { CELATONE_API_ENDPOINT, getChainApiPath, getMainnetApiPath } from "env";
import type {
  PublicContract,
  Option,
  PublicInfo,
  PublicProjectInfo,
  RawPublicContract,
  RawPublicProjectInfo,
  PublicCode,
  RawPublicCode,
} from "lib/types";

const parseContract = (raw: RawPublicContract): PublicContract => ({
  contractAddress: raw.address,
  description: raw.description,
  name: raw.name,
  slug: raw.slug,
  label: raw.label,
  instantiator: raw.instantiator,
  admin: raw.admin,
});

const parseCode = (raw: RawPublicCode): PublicCode => ({
  ...raw,
  contractCount: raw.contracts,
});

export const usePublicProjects = (): UseQueryResult<PublicProjectInfo[]> => {
  const { currentChainRecord } = useWallet();

  const queryFn = useCallback(async () => {
    if (!currentChainRecord)
      throw new Error("No chain selected (usePublicProjects)");

    return axios
      .get<RawPublicProjectInfo[]>(
        `${CELATONE_API_ENDPOINT}/projects/${getChainApiPath(
          currentChainRecord.chain.chain_name
        )}/${getMainnetApiPath(currentChainRecord.chain.chain_id)}`
      )
      .then(({ data: projects }) =>
        projects.map<PublicProjectInfo>((project) => ({
          ...project,
          codes: project.codes.map(parseCode),
          contracts: project.contracts.map(parseContract),
        }))
      );
  }, [currentChainRecord]);

  return useQuery(["public_project", currentChainRecord], queryFn, {
    keepPreviousData: true,
  });
};

export const usePublicProjectBySlug = (
  slug: Option<string>
): UseQueryResult<PublicProjectInfo> => {
  const { currentChainRecord } = useWallet();

  const queryFn = useCallback(async () => {
    if (!slug) throw new Error("No project selected (usePublicProjectBySlug)");
    if (!currentChainRecord)
      throw new Error("No chain selected (usePublicProjectBySlug)");
    return (
      axios
        .get<RawPublicProjectInfo>(
          `${CELATONE_API_ENDPOINT}/projects/${getChainApiPath(
            currentChainRecord.chain.chain_name
          )}/${getMainnetApiPath(currentChainRecord.chain.chain_id)}/${slug}`
        )
        // eslint-disable-next-line sonarjs/no-identical-functions
        .then<PublicProjectInfo>(({ data: project }) => ({
          ...project,
          codes: project.codes.map(parseCode),
          contracts: project.contracts.map(parseContract),
        }))
    );
  }, [currentChainRecord, slug]);

  return useQuery(
    ["public_project_by_slug", slug, currentChainRecord],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!slug,
    }
  );
};

export const usePublicProjectByContractAddress = (
  contractAddress: Option<string>
): UseQueryResult<PublicInfo> => {
  const { currentChainRecord } = useWallet();

  const queryFn = useCallback(async () => {
    if (!contractAddress)
      throw new Error(
        "Contract address not found (usePublicProjectByContractAddress)"
      );
    if (!currentChainRecord)
      throw new Error("No chain selected (usePublicProjectByContractAddress)");
    return axios
      .get<PublicInfo>(
        `${CELATONE_API_ENDPOINT}/contracts/${getChainApiPath(
          currentChainRecord.chain.chain_name
        )}/${currentChainRecord.chain.chain_id}/${contractAddress}`
      )
      .then(({ data: projectInfo }) => projectInfo);
  }, [contractAddress, currentChainRecord]);

  return useQuery(
    ["public_project_by_contract_address", contractAddress, currentChainRecord],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!contractAddress,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
};

export const usePublicProjectByCodeId = (
  codeId: Option<number>
): UseQueryResult<PublicCode> => {
  const { currentChainRecord } = useWallet();

  const queryFn = useCallback(async () => {
    if (!codeId)
      throw new Error("Code ID not found (usePublicProjectByCodeId)");
    if (!currentChainRecord)
      throw new Error("No chain selected (usePublicProjectByCodeId)");

    return axios
      .get<RawPublicCode>(
        `${CELATONE_API_ENDPOINT}/codes/${getChainApiPath(
          currentChainRecord.chain.chain_name
        )}/${currentChainRecord.chain.chain_id}/${codeId}`
      )
      .then(({ data: projectInfo }) => parseCode(projectInfo));
  }, [codeId, currentChainRecord]);

  return useQuery(
    ["public_project_by_code_id", codeId, currentChainRecord],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!codeId,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
};
