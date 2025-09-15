import { Flex, Text } from "@chakra-ui/react";
import { useChainConfigs } from "lib/app-provider";
import { useNonInitiaChainConfig } from "lib/services/chain-config";
import React from "react";

import { TokenImageRender } from "./token";
import { Tooltip } from "./Tooltip";

interface ChainBadgeProps {
  chainId: string | string[];
}

interface BadgeContentProps {
  logo?: string;
  name: string;
  tooltip?: string;
}

const BadgeContent = React.memo(
  ({ logo, name, tooltip }: BadgeContentProps) => {
    const content = (
      <Flex
        className="copier-wrapper"
        align="center"
        gap={1}
        minWidth="max-content"
      >
        <TokenImageRender boxSize={4} logo={logo} minW={4} />
        <Text fontWeight={400} variant="body2" whiteSpace="nowrap">
          {name}
        </Text>
      </Flex>
    );

    return tooltip ? <Tooltip label={tooltip}>{content}</Tooltip> : content;
  }
);

const ChainBadgeSingle = ({ chainId }: { chainId: string }) => {
  const { chainConfigs } = useChainConfigs();
  const { data: nonInitiaChainConfigs } = useNonInitiaChainConfig([chainId]);
  const chainInfo = chainConfigs[chainId];
  const nonInitiaChainInfo = nonInitiaChainConfigs?.[chainId];

  if (nonInitiaChainInfo) {
    return (
      <BadgeContent
        logo={nonInitiaChainInfo.logo_uri}
        name={nonInitiaChainInfo.chain_name || chainId}
        tooltip={`Chain ID: ${chainId}`}
      />
    );
  }

  if (chainInfo) {
    const logo =
      chainInfo.logo_URIs?.svg ||
      chainInfo.logo_URIs?.png ||
      chainInfo.logo_URIs?.jpeg;

    return (
      <BadgeContent
        logo={logo}
        name={chainInfo.prettyName}
        tooltip={`Chain ID: ${chainId}`}
      />
    );
  }

  return <BadgeContent name={chainId} />;
};

const ChainBadgeMultiple = ({ chainId }: { chainId: string[] }) => {
  const { chainConfigs } = useChainConfigs();
  const chainInfos = chainId.map((id) => chainConfigs[id]).filter(Boolean);

  return (
    <Flex overflow="visible">
      {chainInfos.length
        ? chainInfos.map((chainInfo, index) => {
            const logo =
              chainInfo.logo_URIs?.svg ||
              chainInfo.logo_URIs?.png ||
              chainInfo.logo_URIs?.jpeg;

            return (
              <Flex
                key={chainInfo.chainId}
                align="center"
                marginInlineStart={index === 0 ? 0 : "-4px"}
                zIndex={index}
              >
                <TokenImageRender boxSize={4} logo={logo} minW={4} />
              </Flex>
            );
          })
        : chainId.map((chain) => (
            <Flex key={chain} align="center" marginInlineEnd="-4px">
              <TokenImageRender boxSize={4} logo={undefined} minW={4} />
            </Flex>
          ))}
    </Flex>
  );
};

export const ChainBadge = ({ chainId }: ChainBadgeProps) => {
  if (typeof chainId === "string")
    return <ChainBadgeSingle chainId={chainId} />;

  if (chainId.length === 1) return <ChainBadgeSingle chainId={chainId[0]} />;

  return <ChainBadgeMultiple chainId={chainId} />;
};
