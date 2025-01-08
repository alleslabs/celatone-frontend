import { z } from "zod";

import { zUtcDate } from "lib/types";
import { snakeToCamel } from "lib/utils";

const zDockerImageTagResult = z
  .object({
    content_type: z.string(),
    creator: z.number(),
    digest: z.string().optional(),
    full_size: z.number(),
    id: z.number(),
    images: z.array(
      z.object({
        architecture: z.string(),
        digest: z.string(),
        features: z.string(),
        last_pulled: zUtcDate.nullable(),
        last_pushed: zUtcDate.nullable(),
        os: z.string(),
        os_features: z.string(),
        os_version: z.string().nullable(),
        size: z.number(),
        status: z.string(),
        variant: z.string().nullable(),
      })
    ),
    last_updated: zUtcDate,
    last_updater: z.number(),
    last_updater_username: z.string(),
    media_type: z.string(),
    name: z.string(),
    repository: z.number(),
    tag_last_pulled: zUtcDate,
    tag_last_pushed: zUtcDate,
    tag_status: z.string(),
    v2: z.boolean(),
  })
  .transform(snakeToCamel);
export type DockerImageTagResult = z.infer<typeof zDockerImageTagResult>;

export const zDockerImageTag = z
  .object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(zDockerImageTagResult),
  })
  .transform(snakeToCamel);
