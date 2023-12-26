import type { Nullish, Option } from "lib/types";

export const getCw2Info = (
  cw2Contract: Nullish<string>,
  cw2Version: Nullish<string>
): Option<string> =>
  cw2Contract && cw2Version ? `${cw2Contract} (${cw2Version})` : undefined;
