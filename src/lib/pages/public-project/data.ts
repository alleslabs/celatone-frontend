import { useRouter } from "next/router";

import { usePublicProjectBySlug } from "lib/services/publicProjectService";
import type {
  Option,
  PublicAccount,
  PublicCode,
  PublicContract,
  PublicDetail,
  PublicModule,
} from "lib/types";
import { getFirstQueryParam } from "lib/utils";

interface PublicDataState {
  publicCodes: PublicCode[];
  publicContracts: PublicContract[];
  publicAccounts: PublicAccount[];
  publicModules: PublicModule[];
  projectDetail: Option<PublicDetail>;
  slug: string;
  isLoading: boolean;
}

// TODO - Revisit: handle when data is underfined
export const usePublicData = (): PublicDataState => {
  const router = useRouter();
  const projectSlug = getFirstQueryParam(router.query.slug);
  const { data: projectInfo, isLoading } = usePublicProjectBySlug(projectSlug);

  return {
    publicCodes: projectInfo?.codes || [],
    publicContracts: projectInfo?.contracts || [],
    publicAccounts: projectInfo?.accounts || [],
    publicModules: projectInfo?.modules || [],
    projectDetail: projectInfo?.details,
    slug: projectSlug,
    isLoading,
  };
};
