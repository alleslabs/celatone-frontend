import { usePublicProjectBySlug } from "lib/services/publicProjectService";
import type {
  Option,
  PublicAccount,
  PublicCode,
  PublicContract,
  PublicDetail,
  PublicModule,
} from "lib/types";

interface PublicDataState {
  isLoading: boolean;
  projectDetail: Option<PublicDetail>;
  publicAccounts: PublicAccount[];
  publicCodes: PublicCode[];
  publicContracts: PublicContract[];
  publicModules: PublicModule[];
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
