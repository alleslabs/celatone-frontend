import type { FlexProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";
import type { ReactElement } from "react";

import { useSelectChain } from "lib/app-provider";
import { getChainNameByNetwork } from "lib/data";

interface SwitchToTestnetProps extends FlexProps {
  colorHover?: string;
  bgHover?: string;
  icon?: ReactElement;
}

export const SwitchToTestnet = ({
  color = "honeydew.main",
  colorHover = "honeydew.light",
  bgHover,
  icon,
  ...flexProps
}: SwitchToTestnetProps) => {
  const selectChain = useSelectChain();
  return (
    <Flex
      align="center"
      gap={2}
      cursor="pointer"
      borderRadius={8}
      transition="all 0.25s ease-in-out"
      color={color}
      onClick={() => selectChain(getChainNameByNetwork("testnet"))}
      w="fit-content"
      _hover={{ color: colorHover, bgColor: bgHover }}
      {...flexProps}
    >
      <Text color="inherit" variant="body3" fontWeight={700}>
        Switch To Testnet
      </Text>
      {icon}
    </Flex>
  );
};
