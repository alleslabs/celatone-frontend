import { useMemo } from "react";

import { isPositiveInt } from "lib/utils";

export const usePoolExpression = (
  isSupported: boolean,
  isSuperfluidOnly: boolean,
  search: string
) =>
  useMemo(
    () => ({
      is_supported: { _eq: isSupported },
      is_superfluid: isSuperfluidOnly ? { _eq: true } : {},
      id: isPositiveInt(search) ? { _eq: Number(search) } : {},
    }),
    [isSuperfluidOnly, isSupported, search]
  );
