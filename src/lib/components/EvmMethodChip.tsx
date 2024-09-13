import { Tag } from "@chakra-ui/react";
import type { TagProps } from "@chakra-ui/react";

import { getEvmMethod } from "lib/utils";

interface EvmMethodChipProps {
  txInput: string;
  width?: TagProps["width"];
}

export const EvmMethodChip = ({
  txInput,
  width = "144px",
}: EvmMethodChipProps) => (
  <Tag width={width} height="17px" variant="gray" justifyContent="center">
    {getEvmMethod(txInput)}
  </Tag>
);
