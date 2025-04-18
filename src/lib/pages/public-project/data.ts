import type {
  Option,
  PublicAccount,
  PublicCode,
  PublicContract,
  PublicDetail,
  PublicModule,
} from "lib/types";

import { usePublicProjectBySlug } from "lib/services/publicProjectService";

interface PublicDataState {
  publicCodes: PublicCode[];
  publicContracts: PublicContract[];
  publicAccounts: PublicAccount[];
  publicModules: PublicModule[];
  projectDetail: Option<PublicDetail>;
  isLoading: boolean;
}

export const usePublicData = (slug: string): PublicDataState => {
  const { data: projectInfo, isLoading } = usePublicProjectBySlug(slug);

  return {
    isLoading,
    projectDetail: projectInfo?.details,
    publicAccounts: projectInfo?.accounts || [],
    publicCodes: projectInfo?.codes || [],
    publicContracts: projectInfo?.contracts || [],
    publicModules: projectInfo?.modules || [],
  };
};
