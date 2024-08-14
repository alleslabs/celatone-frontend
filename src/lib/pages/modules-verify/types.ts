import { z } from "zod";

export const zModuleVerifyForm = z.object({
  requestNote: z.string().optional(),
  moveFiles: z.array(
    z.instanceof(File).refine((file) => file.name.includes(".move"))
  ),
  tomlFile: z.instanceof(File).refine((file) => file.name.includes(".toml")),
});
export type ModuleVerifyForm = z.infer<typeof zModuleVerifyForm>;
