import type { Option, TokenWithValue } from "lib/types";

import { addTokenWithValue } from "lib/utils";

export const calBonded = (
  totalDelegations: Option<Record<string, TokenWithValue>>,
  totalUnbondings: Option<Record<string, TokenWithValue>>
) => {
  if (!totalDelegations || !totalUnbondings) return undefined;

  const totalBonded = Object.entries(totalDelegations).reduce<
    Record<string, TokenWithValue>
  >(
    (total, [denom, token]) => ({
      ...total,
      [denom]: addTokenWithValue(totalUnbondings[denom], token),
    }),
    {}
  );

  Object.entries(totalUnbondings).forEach(([denom, token]) => {
    if (!totalBonded[denom]) totalBonded[denom] = token;
  });

  return totalBonded;
};
