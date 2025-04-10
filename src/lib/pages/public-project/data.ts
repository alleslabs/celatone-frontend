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
    publicCodes: projectInfo?.codes || [],
    publicContracts: projectInfo?.contracts || [],
    publicAccounts: projectInfo?.accounts || [],
    publicModules: projectInfo?.modules || [],
    projectDetail: projectInfo?.details,
    isLoading,
  };
};
