import { Tag } from "@chakra-ui/react";
import type { TagProps } from "@chakra-ui/react";

const mapMethod = (txInput: string) => {
  if (txInput === "0x") return "transfer";
  return txInput.slice(0, 10);
};

interface EvmMethodChipProps {
  txInput: string;
  width: TagProps["width"];
}

export const EvmMethodChip = ({ txInput, width }: EvmMethodChipProps) => (
  <Tag width={width} height="17px" bgColor="gray.700">
    {mapMethod(txInput)}
  </Tag>
);
