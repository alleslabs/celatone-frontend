import { z } from "zod";

export const zModuleVerifyForm = z.object({
  bytecodeVersion: z.number(),
  compilerVersion: z.string(),
  languageVersion: z.string(),
  moveFiles: z
    .array(z.instanceof(File).refine((file) => file.name.includes(".move")))
    .min(1),
  requestNote: z.string().optional(),
  taskId: z.string().optional(),
  tomlFile: z.instanceof(File).refine((file) => file.name.includes(".toml")),
});
export type ModuleVerifyForm = z.infer<typeof zModuleVerifyForm>;
