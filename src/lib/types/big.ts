import type { BigSource } from "big.js";
import Big from "big.js";
import { z } from "zod";

export const big = (value: BigSource) => Big(value);

export const zBig = z
  .union([z.string(), z.number()])
  .transform((value) => big(value));
