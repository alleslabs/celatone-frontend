import z from "zod";

export const zMyModuleVerificationDetailsQueryParams = z.object({
  taskId: z.string().uuid(),
});
