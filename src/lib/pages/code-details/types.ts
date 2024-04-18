import { z } from "zod";

export enum TabIndex {
  CodeInfo = "info",
  JsonSchema = "schema",
}

export const zCodeDetailsQueryParams = z.object({
  codeId: z.coerce.number().positive(),
  tab: z.union([
    z.nativeEnum(TabIndex),
    z
      .string()
      .optional()
      .transform(() => TabIndex.CodeInfo),
  ]),
});
