import { useRouter } from "next/router";

import { usePublicProjectBySlug } from "lib/services/publicProjectService";
import type {
  PublicCode,
  PublicContract,
  PublicDetail,
  Option,
  Account,
} from "lib/types";
import { getFirstQueryParam } from "lib/utils";

interface PublicDataState {
  publicCodes: PublicCode[];
  publicContracts: PublicContract[];
  publicAccounts: Account[];
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
    projectDetail: projectInfo?.details,
    slug: projectSlug,
    isLoading,
  };
};
