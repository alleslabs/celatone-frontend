import type { Big, BigSource } from "big.js";

import { big } from "lib/types";

export function divWithDefault(
  a: BigSource,
  b: BigSource,
  _default: BigSource
): Big {
  return big(b).eq(0) ? big(_default) : big(a).div(b);
}
