import type { Option } from "lib/types";

export const getCw2Info = (
  cw2Contract: Option<string | null>,
  cw2Version: Option<string | null>
): Option<string> =>
  cw2Contract && cw2Version ? `${cw2Contract} (${cw2Version})` : undefined;
