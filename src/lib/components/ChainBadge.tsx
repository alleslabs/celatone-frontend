import type { ChainConfig } from "@alleslabs/shared";
import type { NonInitiaChainConfig } from "lib/types";

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

const getChainDisplayInfo = (
  chainId: string,
  chainConfigs: Record<string, ChainConfig>,
  nonInitiaChainConfigs?: Record<string, NonInitiaChainConfig>
) => {
  const chainInfo = chainConfigs[chainId];
  const nonInitiaChainInfo = nonInitiaChainConfigs?.[chainId];

  if (chainInfo) {
    return {
      logo:
        chainInfo.logo_URIs?.svg ||
        chainInfo.logo_URIs?.png ||
        chainInfo.logo_URIs?.jpeg,
      name: chainInfo.prettyName,
    };
  }

  if (nonInitiaChainInfo) {
    return {
      logo: nonInitiaChainInfo.logo_uri,
      name: nonInitiaChainInfo.pretty_name || chainId,
    };
  }

  return { logo: undefined, name: chainId };
};

const ChainBadgeSingle = ({ chainId }: { chainId: string }) => {
  const { chainConfigs } = useChainConfigs();
  const { data: nonInitiaChainConfigs } = useNonInitiaChainConfig([chainId]);
  const { logo, name } = getChainDisplayInfo(
    chainId,
    chainConfigs,
    nonInitiaChainConfigs
  );

  return (
    <BadgeContent logo={logo} name={name} tooltip={`Chain ID: ${chainId}`} />
  );
};

const ChainBadgeMultiple = ({ chainIds }: { chainIds: string[] }) => {
  const { chainConfigs } = useChainConfigs();
  const { data: nonInitiaChainConfigs } = useNonInitiaChainConfig(chainIds);

  return (
    <Flex overflow="visible">
      {chainIds.map((id, index) => {
        const { logo } = getChainDisplayInfo(
          id,
          chainConfigs,
          nonInitiaChainConfigs
        );

        return (
          <Flex
            key={id}
            align="center"
            marginInlineStart={index === 0 ? 0 : "-4px"}
            zIndex={index}
          >
            <TokenImageRender boxSize={4} logo={logo} minW={4} />
          </Flex>
        );
      })}
    </Flex>
  );
};

export const ChainBadge = ({ chainId }: ChainBadgeProps) => {
  if (typeof chainId === "string")
    return <ChainBadgeSingle chainId={chainId} />;

  if (chainId.length === 1) return <ChainBadgeSingle chainId={chainId[0]} />;

  return <ChainBadgeMultiple chainIds={chainId} />;
};
