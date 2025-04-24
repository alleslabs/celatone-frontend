/* eslint-disable no-param-reassign */
import type { Nullable } from "lib/types";
import type * as React from "react";

export const mergeRefs = <T = unknown>(
  refs: Array<React.LegacyRef<T> | React.MutableRefObject<T>>
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
