import { Flex, Text } from "@chakra-ui/react";
import { useChainConfigs } from "lib/app-provider";

import { TokenImageRender } from "./token";
import { Tooltip } from "./Tooltip";

interface ChainBadgeProps {
  chainId: string;
}

export const ChainBadge = ({ chainId }: ChainBadgeProps) => {
  const { chainConfigs } = useChainConfigs();
  const chainInfo = chainConfigs[chainId];

  if (!chainInfo) return <Text whiteSpace="nowrap">{chainId}</Text>;

  const logo =
    chainInfo.logo_URIs?.svg ||
    chainInfo.logo_URIs?.png ||
    chainInfo.logo_URIs?.jpeg;

  return (
    <Tooltip label={`Chain ID: ${chainId}`}>
      <Flex
        className="copier-wrapper"
        alignItems="center"
        gap={1}
        minWidth="fit-content"
      >
        <TokenImageRender boxSize={4} logo={logo} />
        <Text fontWeight={400} variant="body2" whiteSpace="nowrap">
          {chainInfo.prettyName}
        </Text>
      </Flex>
    </Tooltip>
  );
};
