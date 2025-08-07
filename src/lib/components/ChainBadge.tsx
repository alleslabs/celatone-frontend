import { Flex, Text } from "@chakra-ui/react";
import { useChainConfigs } from "lib/app-provider";

import { TokenImageRender } from "./token";
import { Tooltip } from "./Tooltip";

interface ChainBadgeProps {
  chainId: string | string[];
}

const ChainBadgeSingle = ({ chainId }: { chainId: string }) => {
  const { chainConfigs } = useChainConfigs();
  const chainInfo = chainConfigs[chainId];

  if (!chainInfo)
    return (
      <Flex
        className="copier-wrapper"
        align="center"
        gap={1}
        minWidth="fit-content"
      >
        <TokenImageRender boxSize={4} logo={undefined} />
        <Text whiteSpace="nowrap">{chainId}</Text>
      </Flex>
    );

  const logo =
    chainInfo.logo_URIs?.svg ||
    chainInfo.logo_URIs?.png ||
    chainInfo.logo_URIs?.jpeg;

  return (
    <Tooltip label={`Chain ID: ${chainId}`}>
      <Flex
        className="copier-wrapper"
        align="center"
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

const ChainBadgeMultiple = ({ chainId }: { chainId: string[] }) => {
  const { chainConfigs } = useChainConfigs();
  const chainInfos = chainId.map((id) => chainConfigs[id]).filter(Boolean);

  if (!chainInfos.length)
    return <TokenImageRender boxSize={4} logo={undefined} />;

  return (
    <Flex>
      {chainInfos.map((chainInfo) => {
        const logo =
          chainInfo.logo_URIs?.svg ||
          chainInfo.logo_URIs?.png ||
          chainInfo.logo_URIs?.jpeg;

        return (
          <Flex key={chainInfo.chainId} align="center" marginInlineEnd="-4px">
            <TokenImageRender boxSize={4} logo={logo} />
          </Flex>
        );
      })}
    </Flex>
  );
};

export const ChainBadge = ({ chainId }: ChainBadgeProps) => {
  if (typeof chainId === "string")
    return <ChainBadgeSingle chainId={chainId} />;

  return <ChainBadgeMultiple chainId={chainId} />;
};
