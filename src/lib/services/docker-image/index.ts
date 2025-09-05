import { useQuery } from "@tanstack/react-query";
import { CELATONE_QUERY_KEYS } from "lib/app-provider";

import { getDockerImageTag } from "./api";

export const useDockerImageTag = (repository: string, image: string) =>
  useQuery({
    queryKey: [CELATONE_QUERY_KEYS.DOCKER_IMAGE_TAG, repository, image],
    queryFn: async () => getDockerImageTag(repository, image),
    refetchOnWindowFocus: false,
  });
