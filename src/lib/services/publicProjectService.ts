import type { UseQueryResult } from "@tanstack/react-query";
import type {
  Option,
  PublicCode,
  PublicContract,
  PublicInfo,
  PublicModule,
  PublicProjectInfo,
  RawPublicCode,
  RawPublicContract,
  RawPublicProjectInfo,
} from "lib/types";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useMoveConfig,
  usePublicProjectConfig,
  useWasmConfig,
} from "lib/app-provider";
import { isId } from "lib/utils";
import { useCallback } from "react";

const parseContract = (raw: RawPublicContract): PublicContract => ({
  contractAddress: raw.address,
  ...raw,
});

const parseCode = (raw: RawPublicCode): PublicCode => ({
  ...raw,
  contractCount: raw.contracts,
});

export const usePublicProjects = (): UseQueryResult<PublicProjectInfo[]> => {
  const projectsApiRoute = useBaseApiRoute("projects");
  const projectConfig = usePublicProjectConfig({ shouldRedirect: false });

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

  return useQuery({
    enabled: projectConfig.enabled,
    queryFn,
    queryKey: [CELATONE_QUERY_KEYS.PUBLIC_PROJECTS, projectsApiRoute],
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const usePublicProjectBySlug = (
  slug: Option<string>
): UseQueryResult<PublicProjectInfo> => {
  const projectsApiRoute = useBaseApiRoute("projects");
  const projectConfig = usePublicProjectConfig({ shouldRedirect: false });

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

  return useQuery({
    enabled: Boolean(slug) && projectConfig.enabled,
    queryFn,
    queryKey: [
      CELATONE_QUERY_KEYS.PUBLIC_PROJECT_BY_SLUG,
      projectsApiRoute,
      slug,
    ],
    retry: false,
  });
};

export const usePublicProjectByCodeId = (
  codeId: string
): UseQueryResult<PublicCode> => {
  const projectsApiRoute = useBaseApiRoute("public_codes");
  const projectConfig = usePublicProjectConfig({ shouldRedirect: false });
  const wasmConfig = useWasmConfig({ shouldRedirect: false });

  const queryFn = useCallback(async () => {
    if (!codeId)
      throw new Error("Code ID not found (usePublicProjectByCodeId)");

    return axios
      .get<RawPublicCode>(`${projectsApiRoute}/${codeId}`)
      .then(({ data: projectInfo }) => parseCode(projectInfo));
  }, [projectsApiRoute, codeId]);

  return useQuery({
    enabled: isId(codeId) && projectConfig.enabled && wasmConfig.enabled,
    queryFn,
    queryKey: [
      CELATONE_QUERY_KEYS.PUBLIC_PROJECT_BY_CODE_ID,
      projectsApiRoute,
      codeId,
    ],
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const usePublicProjectByAccountAddress = (
  accountAddress: Option<string>
): UseQueryResult<PublicInfo> => {
  const projectsApiRoute = useBaseApiRoute("legacy.accounts");
  const projectConfig = usePublicProjectConfig({ shouldRedirect: false });

  const queryFn = useCallback(async () => {
    if (!accountAddress)
      throw new Error(
        "Wallet address not found (usePublicProjectByAccountAddress)"
      );
    return axios
      .get<PublicInfo>(`${projectsApiRoute}/${accountAddress}`)
      .then(({ data: projectInfo }) => projectInfo);
  }, [accountAddress, projectsApiRoute]);
  return useQuery({
    enabled: Boolean(accountAddress) && projectConfig.enabled,
    queryFn,
    queryKey: [
      CELATONE_QUERY_KEYS.PUBLIC_PROJECT_BY_WALLET_ADDRESS,
      projectsApiRoute,
      accountAddress,
    ],
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const usePublicProjectByModulePath = (
  address: Option<string>,
  name: Option<string>
): UseQueryResult<PublicModule> => {
  const projectsApiRoute = useBaseApiRoute("move_modules");
  const projectConfig = usePublicProjectConfig({ shouldRedirect: false });
  const moveConfig = useMoveConfig({ shouldRedirect: false });

  const queryFn = useCallback(async () => {
    if (!address)
      throw new Error(
        "Module address not found (usePublicProjectByContractAddress)"
      );
    return axios
      .get<PublicModule>(`${projectsApiRoute}/${address}/${name}`)
      .then(({ data: projectInfo }) => projectInfo);
  }, [projectsApiRoute, address, name]);

  return useQuery({
    enabled: Boolean(address) && projectConfig.enabled && moveConfig.enabled,
    queryFn,
    queryKey: [
      CELATONE_QUERY_KEYS.PUBLIC_PROJECT_BY_MODULE_PATH,
      projectsApiRoute,
      address,
      name,
    ],
    refetchOnWindowFocus: false,
    retry: false,
  });
};
