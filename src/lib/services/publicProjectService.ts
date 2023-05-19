import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback } from "react";

import { useBaseApiRoute } from "lib/app-provider";
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
  const projectsApiRoute = useBaseApiRoute("projects");

  const queryFn = useCallback(async () => {
    return axios
      .get<RawPublicProjectInfo[]>(projectsApiRoute)
      .then(({ data: projects }) =>
        projects.map<PublicProjectInfo>((project) => ({
          ...project,
          codes: project.codes.map(parseCode),
          contracts: project.contracts.map(parseContract),
        }))
      );
  }, [projectsApiRoute]);

  return useQuery(["public_project", projectsApiRoute], queryFn, {
    keepPreviousData: true,
  });
};

export const usePublicProjectBySlug = (
  slug: Option<string>
): UseQueryResult<PublicProjectInfo> => {
  const projectsApiRoute = useBaseApiRoute("projects");

  const queryFn = useCallback(async () => {
    if (!slug) throw new Error("No project selected (usePublicProjectBySlug)");
    return axios
      .get<RawPublicProjectInfo>(`${projectsApiRoute}/${slug}`)
      .then<PublicProjectInfo>(({ data: publicProject }) => ({
        ...publicProject,
        codes: publicProject.codes.map(parseCode),
        contracts: publicProject.contracts.map(parseContract),
      }));
  }, [projectsApiRoute, slug]);

  return useQuery(["public_project_by_slug", projectsApiRoute, slug], queryFn, {
    enabled: !!slug,
  });
};

export const usePublicProjectByContractAddress = (
  contractAddress: Option<string>
): UseQueryResult<PublicInfo> => {
  const projectsApiRoute = useBaseApiRoute("contracts");

  const queryFn = useCallback(async () => {
    if (!contractAddress)
      throw new Error(
        "Contract address not found (usePublicProjectByContractAddress)"
      );
    return axios
      .get<PublicInfo>(`${projectsApiRoute}/${contractAddress}`)
      .then(({ data: projectInfo }) => projectInfo);
  }, [projectsApiRoute, contractAddress]);

  return useQuery(
    ["public_project_by_contract_address", projectsApiRoute, contractAddress],
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
  const projectsApiRoute = useBaseApiRoute("codes");

  const queryFn = useCallback(async () => {
    if (!codeId)
      throw new Error("Code ID not found (usePublicProjectByCodeId)");

    return axios
      .get<RawPublicCode>(`${projectsApiRoute}/${codeId}`)
      .then(({ data: projectInfo }) => parseCode(projectInfo));
  }, [projectsApiRoute, codeId]);

  return useQuery(
    ["public_project_by_code_id", projectsApiRoute, codeId],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!codeId,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
};
