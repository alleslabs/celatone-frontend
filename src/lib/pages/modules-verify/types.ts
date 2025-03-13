import { z } from "zod";

export const zModuleVerifyForm = z.object({
  taskId: z.string().optional(),
  requestNote: z.string().optional(),
  moveFiles: z
    .array(z.instanceof(File).refine((file) => file.name.includes(".move")))
    .min(1),
  tomlFile: z.instanceof(File).refine((file) => file.name.includes(".toml")),
  languageVersion: z.string(),
  compilerVersion: z.string(),
  bytecodeVersion: z.number(),
});
export type ModuleVerifyForm = z.infer<typeof zModuleVerifyForm>;
