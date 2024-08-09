import axios from "axios";

import { zDockerImageTag } from "../types/docker-image";
import { parseWithError } from "lib/utils";

export const getDockerImageTag = async (repository: string, image: string) =>
  axios
    .get(`/docker/image/${repository}/repositories/${image}/tags`)
    .then(({ data }) => parseWithError(zDockerImageTag, data));
