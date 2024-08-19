import { z } from "zod";

export const zModuleVerifyForm = z.object({
  taskId: z.string().optional(),
  requestNote: z.string().optional(),
  moveFiles: z
    .array(z.instanceof(File).refine((file) => file.name.includes(".move")))
    .length(1),
  tomlFile: z.instanceof(File).refine((file) => file.name.includes(".toml")),
});
export type ModuleVerifyForm = z.infer<typeof zModuleVerifyForm>;
