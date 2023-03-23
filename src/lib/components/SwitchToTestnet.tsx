import { Text } from "@chakra-ui/react";
import type { ReactElement } from "react";

import { useSelectChain } from "lib/app-provider";
import { getChainNameByNetwork } from "lib/data";

interface SwitchToTestnetProps {
  size?: string;
  color?: string;
  colorHover?: string;
  bgHover?: string;
  padding?: string;
  icon?: ReactElement;
}
export const SwitchToTestnet = ({
  size = "md",
  padding = "0",
  color = "honeydew.main",
  colorHover = "honeydew.light",
  bgHover,
  icon,
}: SwitchToTestnetProps) => {
  const selectChain = useSelectChain();
  return (
    <Text
      size={size}
      cursor="pointer"
      p={padding}
      borderRadius={8}
      pl="2"
      width="fit-content"
      transition="all 0.25s ease-in-out"
      color={color}
      _hover={{ color: colorHover, bgColor: bgHover }}
      onClick={() => selectChain(getChainNameByNetwork("testnet"))}
    >
      Switch to testnet
      {icon}
    </Text>
  );
};
