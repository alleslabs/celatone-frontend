import { Accordion, Divider, Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo } from "react";

import type { ChainConfig } from "config/chain";
import { CHAIN_CONFIGS } from "config/chain";
import { useCelatoneApp } from "lib/app-provider";
import { EmptyState } from "lib/components/state";
import { useNetworkStore } from "lib/providers/store";
import type { Option } from "lib/types";

import { NetworkAccordion } from "./NetworkAccordion";
import { NetworkAccodionPinned } from "./NetworkAccordionPinned";

const filterChains = (
  chainIds: string[],
  keyword: string,
  type?: ChainConfig["networkType"]
) => {
  const chainIdsByType = type
    ? chainIds.filter((chainId) => CHAIN_CONFIGS[chainId]?.networkType === type)
    : chainIds;

  return chainIdsByType.filter(
    (chainId) =>
      !keyword ||
      CHAIN_CONFIGS[chainId]?.prettyName
        .toLowerCase()
        .includes(keyword.toLowerCase()) ||
      chainId.toLowerCase().includes(keyword.toLowerCase())
  );
};

interface NetworkMenuBodyProps {
  keyword: string;
  setNetworks: (networks: string[]) => void;
  cursor: Option<number>;
  setCursor: (cursor: Option<number>) => void;
  onClose: () => void;
}

export const NetworkMenuBody = observer(
  ({
    keyword,
    setNetworks,
    cursor,
    setCursor,
    onClose,
  }: NetworkMenuBodyProps) => {
    const { availableChainIds } = useCelatoneApp();
    const { getPinnedNetworks } = useNetworkStore();
    const pinnedNetworks = getPinnedNetworks();

    const [filteredPinnedChains, filteredMainnetChains, filteredTestnetChains] =
      useMemo(
        () => [
          filterChains(pinnedNetworks, keyword),
          filterChains(availableChainIds, keyword, "mainnet"),
          filterChains(availableChainIds, keyword, "testnet"),
        ],
        [availableChainIds, keyword, pinnedNetworks]
      );

    const allNetworks = useMemo(
      () => [
        ...filteredPinnedChains,
        ...filteredMainnetChains,
        ...filteredTestnetChains,
      ],
      [filteredPinnedChains, filteredMainnetChains, filteredTestnetChains]
    );

    useEffect(() => {
      setCursor(undefined);
      setNetworks(allNetworks);
    }, [allNetworks, setCursor, setNetworks]);

    return (
      <Flex direction="column" gap={6}>
        <Accordion
          variant="transparent"
          allowMultiple
          defaultIndex={[0, 1, 2]}
          width="full"
          p={0}
        >
          <Flex direction="column" gap={4}>
            <NetworkAccodionPinned
              pinnedNetworks={filteredPinnedChains}
              cursor={cursor}
              setCursor={setCursor}
              onClose={onClose}
            />
            {!!filteredPinnedChains.length && (
              <Divider borderColor="gray.700" />
            )}
            <NetworkAccordion
              title="Mainnet"
              networks={filteredMainnetChains}
              cursor={cursor}
              setCursor={setCursor}
              startIndex={filteredPinnedChains.length}
              onClose={onClose}
            />
            {!!filteredMainnetChains && <Divider borderColor="gray.700" />}
            <NetworkAccordion
              title="Testnet"
              networks={filteredTestnetChains}
              cursor={cursor}
              setCursor={setCursor}
              startIndex={
                filteredPinnedChains.length + filteredMainnetChains.length
              }
              onClose={onClose}
            />
          </Flex>
        </Accordion>
        {allNetworks.length === 0 && (
          <EmptyState
            my={0}
            imageVariant="empty"
            imageWidth={40}
            textVariant="body2"
            message="No matched result found.
Please check your keyword."
          />
        )}
      </Flex>
    );
  }
);
