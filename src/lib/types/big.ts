import type { BigSource } from "big.js";
import Big from "big.js";
import { z } from "zod";

export const big = (value: BigSource) => Big(value);

export const zBig = z.string().transform((value) => big(value));
