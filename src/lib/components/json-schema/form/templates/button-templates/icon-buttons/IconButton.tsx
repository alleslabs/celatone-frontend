/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import type { IconButtonProps } from "@rjsf/utils";

import { CustomIcon } from "lib/components/icon";

import ChakraIconButton from "./ChakraIconButton";

export function MoveDownButton<T = any, F = any>(props: IconButtonProps<T, F>) {
  return (
    <ChakraIconButton<T, F>
      title="Move Down"
      {...props}
      icon={<ArrowDownIcon />}
    />
  );
}

export function MoveUpButton<T = any, F = any>(props: IconButtonProps<T, F>) {
  return (
    <ChakraIconButton<T, F> title="Move Up" {...props} icon={<ArrowUpIcon />} />
  );
}

export function RemoveButton<T = any, F = any>(props: IconButtonProps<T, F>) {
  return (
    <ChakraIconButton<T, F>
      title="Remove"
      {...props}
      icon={<CustomIcon name="delete" boxSize={3} />}
    />
  );
}
