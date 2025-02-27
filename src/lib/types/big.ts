import type { BigSource } from "big.js";
import Big from "big.js";
import { z } from "zod";

export const big = (value: BigSource) => Big(value);

export const zBig = z
  .union([z.string(), z.number(), z.bigint().transform(String)])
  .transform((value) => big(value));
