import type { TagProps } from "@chakra-ui/react";
import type { HexAddr20, Nullable } from "lib/types";

import { Tag } from "@chakra-ui/react";
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
  <Tag height="17px" justifyContent="center" variant="gray" width={width}>
    {getEvmMethod(txInput, txTo)}
  </Tag>
);
