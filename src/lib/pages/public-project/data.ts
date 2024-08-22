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
  publicCodes: PublicCode[];
  publicContracts: PublicContract[];
  publicAccounts: PublicAccount[];
  publicModules: PublicModule[];
  projectDetail: Option<PublicDetail>;
  isLoading: boolean;
}

// TODO - Revisit: handle when data is underfined
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
