import { z } from "zod";

import { snakeToCamel } from "lib/utils";

const zDockerImageTagResult = z.object({
  creator: z.number(),
  id: z.number(),
  images: z.array(
    z.object({
      architecture: z.string(),
      features: z.string(),
      variant: z.string().nullable(),
      digest: z.string(),
      os: z.string(),
      os_features: z.string(),
      os_version: z.string().nullable(),
      size: z.number(),
      status: z.string(),
      last_pulled: z.string(),
      last_pushed: z.string(),
    })
  ),
  last_updated: z.string(),
  last_updater: z.number(),
  last_updater_username: z.string(),
  name: z.string(),
  repository: z.number(),
  full_size: z.number(),
  v2: z.boolean(),
  tag_status: z.string(),
  tag_last_pulled: z.string(),
  tag_last_pushed: z.string(),
  media_type: z.string(),
  content_type: z.string(),
  digest: z.string(),
});
export type DockerImageTagResult = z.infer<typeof zDockerImageTagResult>;

export const zDockerImageTag = z
  .object({
    count: z.number(),
    next: z.string(),
    previous: z.string().nullable(),
    results: z.array(zDockerImageTagResult),
  })
  .transform(snakeToCamel);
export type DockerImageTag = z.infer<typeof zDockerImageTag>;
