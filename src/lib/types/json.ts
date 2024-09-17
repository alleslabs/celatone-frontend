import { z } from "zod";

export const zJsonDataType = z.unknown();
export type JsonDataType = z.infer<typeof zJsonDataType>;
