import axios from "axios";

import { parseWithError } from "lib/utils";
import type { DockerImageTagResult } from "../types/docker-image";
import { zDockerImageTag } from "../types/docker-image";

export const getDockerImageTag = async (repository: string, image: string) => {
  const result: DockerImageTagResult[] = [];
  const fetchFn = async (page: number) => {
    const res = await axios
      .get(`/docker/image/${repository}/repositories/${image}/tags`, {
        params: {
          page,
          page_size: 100,
        },
      })
      .then(({ data }) => parseWithError(zDockerImageTag, data));
    result.push(...res.results);
    if (res.next) await fetchFn(page + 1);
  };

  await fetchFn(1);

  return result;
};
