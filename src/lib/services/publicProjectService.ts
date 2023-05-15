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
  const baseApiRoute = useBaseApiRoute("projects");

  const queryFn = useCallback(async () => {
    if (!baseApiRoute)
      throw new Error("Failed to retrieve projects API route.");

    return axios
      .get<RawPublicProjectInfo[]>(baseApiRoute)
      .then(({ data: projects }) =>
        projects.map<PublicProjectInfo>((project) => ({
          ...project,
          codes: project.codes.map(parseCode),
          contracts: project.contracts.map(parseContract),
        }))
      );
  }, [baseApiRoute]);

  return useQuery(["public_project", baseApiRoute], queryFn, {
    keepPreviousData: true,
  });
};

export const usePublicProjectBySlug = (
  slug: Option<string>
): UseQueryResult<PublicProjectInfo> => {
  const baseApiRoute = useBaseApiRoute("projects");

  const queryFn = useCallback(async () => {
    if (!slug) throw new Error("No project selected (usePublicProjectBySlug)");
    if (!baseApiRoute)
      throw new Error("Failed to retrieve projects API route.");
    return axios
      .get<RawPublicProjectInfo>(`${baseApiRoute}/${slug}`)
      .then<PublicProjectInfo>(({ data: publicProject }) => ({
        ...publicProject,
        codes: publicProject.codes.map(parseCode),
        contracts: publicProject.contracts.map(parseContract),
      }));
  }, [baseApiRoute, slug]);

  return useQuery(["public_project_by_slug", baseApiRoute, slug], queryFn, {
    enabled: !!slug,
  });
};

export const usePublicProjectByContractAddress = (
  contractAddress: Option<string>
): UseQueryResult<PublicInfo> => {
  const baseApiRoute = useBaseApiRoute("contracts");

  const queryFn = useCallback(async () => {
    if (!contractAddress)
      throw new Error(
        "Contract address not found (usePublicProjectByContractAddress)"
      );
    if (!baseApiRoute)
      throw new Error("Failed to retrieve contracts API route.");
    return axios
      .get<PublicInfo>(`${baseApiRoute}/${contractAddress}`)
      .then(({ data: projectInfo }) => projectInfo);
  }, [baseApiRoute, contractAddress]);

  return useQuery(
    ["public_project_by_contract_address", baseApiRoute, contractAddress],
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
  const baseApiRoute = useBaseApiRoute("codes");

  const queryFn = useCallback(async () => {
    if (!codeId)
      throw new Error("Code ID not found (usePublicProjectByCodeId)");
    if (!baseApiRoute) throw new Error("Failed to retrieve codes API route.");

    return axios
      .get<RawPublicCode>(`${baseApiRoute}/${codeId}`)
      .then(({ data: projectInfo }) => parseCode(projectInfo));
  }, [baseApiRoute, codeId]);

  return useQuery(
    ["public_project_by_code_id", baseApiRoute, codeId],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!codeId,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
};
