import { useQuery } from "@tanstack/react-query";

import { CELATONE_QUERY_KEYS } from "lib/app-provider";

import { getDockerImageTag } from "./api";

export const useDockerImageTag = (repository: string, image: string) => {
  const endpoint = "/api/docker/image/tag";

  return useQuery(
    [CELATONE_QUERY_KEYS.DOCKER_IMAGE_TAG, endpoint, repository, image],
    async () => getDockerImageTag(endpoint, repository, image),
    {
      refetchOnWindowFocus: false,
    }
  );
};
