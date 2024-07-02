import { useQuery } from "@tanstack/react-query";

import { CELATONE_QUERY_KEYS } from "lib/app-provider";

import { getDockerImageTag } from "./external";

export const useDockerImageTag = (repository: string, image: string) => {
  const endpoint = "https://hub.docker.com/v2/namespaces";

  return useQuery(
    [CELATONE_QUERY_KEYS.DOCKER_IMAGE_TAG, endpoint, repository, image],
    async () => getDockerImageTag(endpoint, repository, image),
    {
      refetchOnWindowFocus: false,
    }
  );
};
