import type { Nullable, Option } from "lib/types";

export const getCw2Info = (
  cw2Contract: Option<Nullable<string>>,
  cw2Version: Option<Nullable<string>>
): Option<string> =>
  cw2Contract && cw2Version ? `${cw2Contract} (${cw2Version})` : undefined;
