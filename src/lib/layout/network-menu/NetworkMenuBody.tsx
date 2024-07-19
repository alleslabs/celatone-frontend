/* eslint-disable sonarjs/cognitive-complexity */
import { Accordion, Divider, Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useCallback, useMemo, useState } from "react";

import { CHAIN_CONFIGS } from "config/chain";
import { useCelatoneApp, useMobile, useSelectChain } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import { EmptyState } from "lib/components/state";
import { useNetworkStore } from "lib/providers/store";
import type { Option } from "lib/types";

import { NetworkAccordion } from "./NetworkAccordion";
import { NetworkAccodionPinned } from "./NetworkAccordionPinned";

interface NetworkMenuBodyProps {
  onClose: () => void;
}

const filterChains = (
  chainIds: string[],
  keyword: string,
  type: "mainnet" | "testnet"
) =>
  chainIds
    .filter((chain) => CHAIN_CONFIGS[chain]?.networkType === type)
    .filter(
      (network) =>
        !keyword ||
        CHAIN_CONFIGS[network]?.prettyName
          .toLowerCase()
          .includes(keyword.toLowerCase()) ||
        network.toLowerCase().includes(keyword.toLowerCase())
    );

const getNextCursor = (
  key: string,
  current: Option<number>,
  lastIndex: number
) => {
  switch (key) {
    case "ArrowUp":
      if (current === undefined) return lastIndex;
      return current <= 0 ? lastIndex : current - 1;
    case "ArrowDown":
      if (current === undefined) return 0;
      return current >= lastIndex ? 0 : current + 1;
    default:
      return undefined;
  }
};

export const NetworkMenuBody = observer(({ onClose }: NetworkMenuBodyProps) => {
  const isMobile = useMobile();
  const selectChain = useSelectChain();
  const { availableChainIds } = useCelatoneApp();
  const { getPinnedNetworks } = useNetworkStore();

  const [cursor, setCursor] = useState<number>();
  const [keyword, setKeyword] = useState("");

  // Get chains info
  const pinnedNetworks = getPinnedNetworks();
  const filteredPinnedNetworks = useMemo(() => {
    if (!keyword) return [...pinnedNetworks];
    return pinnedNetworks.filter(
      (network) =>
        CHAIN_CONFIGS[network.chainId]?.prettyName
          .toLowerCase()
          .includes(keyword.toLowerCase()) ||
        network.chainId.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [pinnedNetworks, keyword]);

  const [filteredMainnetChains, filteredTestnetChains] = useMemo(
    () => [
      filterChains(availableChainIds, keyword, "mainnet"),
      filterChains(availableChainIds, keyword, "testnet"),
    ],
    [availableChainIds, keyword]
  );

  const allNetworks = useMemo(
    () => [
      ...filteredPinnedNetworks.map((network) => network.chainId),
      ...filteredMainnetChains,
      ...filteredTestnetChains,
    ],
    [filteredPinnedNetworks, filteredMainnetChains, filteredTestnetChains]
  );

  // Navigate with arrow keys
  const handleOnKeyEnter = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (!allNetworks.length) return;
      switch (e.key) {
        case "ArrowUp":
        case "ArrowDown": {
          const lastIndex = allNetworks.length - 1;
          const nextCursor = getNextCursor(e.key, cursor, lastIndex);
          const listItem = document.getElementById(`item-${nextCursor}`);
          e.preventDefault();
          setCursor(nextCursor);
          listItem?.scrollIntoView({ block: "nearest", inline: "center" });
          break;
        }
        case "Enter":
          e.currentTarget.blur();
          if (cursor) {
            const selectedNetwork = allNetworks[cursor].toString();
            selectChain(selectedNetwork);
            onClose();
          }
          break;
        default:
          break;
      }
    },
    [allNetworks, cursor, selectChain, onClose, setCursor]
  );

  return (
    <Flex direction="column" gap={6}>
      <InputWithIcon
        placeholder="Search by Name or Chain ID"
        size="md"
        value={keyword}
        autoFocus={!isMobile}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleOnKeyEnter}
        amptrackSection="network-search"
      />
      <Accordion
        variant="transparent"
        allowMultiple
        defaultIndex={[0, 1, 2]}
        width="full"
        p={0}
      >
        <NetworkAccodionPinned
          pinnedNetworks={filteredPinnedNetworks}
          cursor={cursor}
          setCursor={setCursor}
          onClose={onClose}
        />
        {filteredPinnedNetworks.length > 0 && (
          <Divider
            borderColor="gray.700"
            pt={filteredPinnedNetworks.length ? 2 : 0}
            mb={4}
          />
        )}
        <NetworkAccordion
          title="Mainnet"
          networks={filteredMainnetChains}
          cursor={cursor}
          setCursor={setCursor}
          startIndex={filteredPinnedNetworks.length}
          onClose={onClose}
        />
        {filteredMainnetChains.length > 0 && (
          <Divider
            borderColor="gray.700"
            pt={filteredPinnedNetworks.length ? 2 : 0}
            mb={4}
          />
        )}
        <NetworkAccordion
          title="Testnet"
          networks={filteredTestnetChains}
          cursor={cursor}
          setCursor={setCursor}
          startIndex={
            filteredPinnedNetworks.length + filteredMainnetChains.length
          }
          onClose={onClose}
        />
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
});
