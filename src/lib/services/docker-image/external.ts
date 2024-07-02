import axios from "axios";

import { zDockerImageTag } from "../types/docker-image";
import { parseWithError } from "lib/utils";

export const getDockerImageTag = async (
  endpoint: string,
  repository: string,
  image: string
) =>
  axios
    .get(`${endpoint}/${repository}/repositories/${image}/tags`)
    .then(({ data }) => parseWithError(zDockerImageTag, data));
