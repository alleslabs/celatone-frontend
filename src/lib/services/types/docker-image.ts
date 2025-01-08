import { z } from "zod";

import { zUtcDate } from "lib/types";
import { snakeToCamel } from "lib/utils";

const zDockerImageTagResult = z
  .object({
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
        last_pulled: zUtcDate.nullable(),
        last_pushed: zUtcDate.nullable(),
      })
    ),
    last_updated: zUtcDate,
    last_updater: z.number(),
    last_updater_username: z.string(),
    name: z.string(),
    repository: z.number(),
    full_size: z.number(),
    v2: z.boolean(),
    tag_status: z.string(),
    tag_last_pulled: zUtcDate,
    tag_last_pushed: zUtcDate,
    media_type: z.string(),
    content_type: z.string(),
    digest: z.string().optional(),
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
