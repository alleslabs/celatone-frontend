import { Tag } from "@chakra-ui/react";
import type { TagProps } from "@chakra-ui/react";
import type { HexAddr20, Nullable } from "lib/types";

import { getEvmMethod } from "lib/utils";

interface EvmMethodChipProps {
  txInput: string;
  txTo: Nullable<HexAddr20>;
  width?: TagProps["width"];
}

export const EvmMethodChip = ({
  txInput,
  txTo,
  width = "144px",
}: EvmMethodChipProps) => (
  <Tag width={width} height="17px" variant="gray" justifyContent="center">
    {getEvmMethod(txInput, txTo)}
  </Tag>
);
