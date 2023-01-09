import { useRouter } from "next/router";

import { usePublicProjectBySlugQuery } from "lib/services/publicProject";
import { getFirstQueryParam } from "lib/utils";

// TODO:
// 1. contract -> get instantiator
// 2. code -> get uploader
// 3. code -> get contract amount that instantiated from this code ID
// 4. code -> get permission and render the right tag (already has UI)

// interface PublicCodes extends Code {
//   uploader: HumanAddr | ContractAddr;
// }
// interface PublicContracts extends Contract {
//   instantiator: HumanAddr | ContractAddr;
// }
// interface ProjectData {
//   publicCodes: PublicCodes[];
//   publicContracts: PublicContracts[];
//   projectDetail: PublicProjectInfo["details"] | undefined;
// }
export const usePublicData = () => {
  const router = useRouter();
  const projectSlug = getFirstQueryParam(router.query.slug);
  const { data: projectInfo } = usePublicProjectBySlugQuery(projectSlug);

  const codes = projectInfo?.codes || [];
  const contracts = projectInfo?.contracts || [];
  const projectDetail = projectInfo?.details;
  const slug = projectSlug;

  // const { data: instantiateInfo } = useQuery(
  //   ["query", "instantiateInfo", contractAddress],
  //   async () => queryInstantiateInfo(endpoint, contractAddress),
  //   { enabled: !!currentChainRecord }
  // );

  return {
    publicCodes: codes,
    publicContracts: contracts,
    projectDetail,
    slug,
  };
};
