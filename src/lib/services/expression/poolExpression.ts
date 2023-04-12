import { useMemo } from "react";

export const usePoolExpression = (
  isSupported: boolean,
  isSuperfluidOnly: boolean,
  search: string
) =>
  useMemo(
    () => ({
      is_supported: { _eq: isSupported },
      is_superfluid: isSuperfluidOnly ? { _eq: true } : {},
      id: search.trim().length ? { _eq: Number(search) } : {},
    }),
    [isSuperfluidOnly, isSupported, search]
  );
