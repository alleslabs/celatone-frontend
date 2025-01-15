/* eslint-disable no-param-reassign */
import type * as React from "react";

import type { Nullable } from "lib/types";

export const mergeRefs = <T = unknown>(
  refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>
): React.RefCallback<T> => {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref !== null) {
        (ref as React.MutableRefObject<Nullable<T>>).current = value;
      }
    });
  };
};
