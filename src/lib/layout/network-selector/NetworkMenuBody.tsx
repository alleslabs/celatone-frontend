import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Divider,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { DndContext } from "@dnd-kit/core";
import { observer } from "mobx-react-lite";
import { useCallback, useMemo, useState } from "react";

import { CHAIN_CONFIGS } from "config/chain";
import { useCelatoneApp } from "lib/app-provider";
import { EmptyState } from "lib/components/state";
import { useNetworkStore } from "lib/providers/store";

import { NetworkCard } from "./NetworkCard";
import { SortableList } from "./SortableList";

interface AccordionNetworkListProps {
  title: string;
  networks: string[];
  currentChainId: string;
  isHidden?: boolean;
}

interface NetworkMenuBodyProps {
  currentChainId: string;
  keyword: string;
}

const AccordionNetworkList = ({
  title,
  networks,
  currentChainId,
  isHidden = false,
}: AccordionNetworkListProps) => (
  <AccordionItem hidden={isHidden}>
    <AccordionButton p={0}>
      <Flex mb={4} justifyContent="space-between" w="full">
        <Heading as="h6" variant="h6">
          {title}
        </Heading>
        <AccordionIcon color="gray.600" />
      </Flex>
    </AccordionButton>
    <AccordionPanel p={0}>
      <Flex direction="column" gap={1}>
        {networks.map((chainId) => (
          <NetworkCard
            key={chainId}
            image={CHAIN_CONFIGS[chainId]?.logoUrl}
            chainId={chainId}
            isSelected={chainId === currentChainId}
          />
        ))}
      </Flex>
    </AccordionPanel>
  </AccordionItem>
);

export const ItemTypes = {
  CARD: "card",
};

export const NetworkMenuBody = observer(
  ({ currentChainId, keyword }: NetworkMenuBodyProps) => {
    const { availableChainIds } = useCelatoneApp();

    const filteredChains = useCallback(
      (type: string) =>
        useMemo(() => {
          const filtered = availableChainIds.filter(
            (chain) => CHAIN_CONFIGS[chain]?.networkType === type
          );
          if (!keyword) return filtered;
          return filtered.filter(
            (chain) =>
              CHAIN_CONFIGS[chain]?.prettyName
                .toLowerCase()
                .includes(keyword.toLowerCase()) ||
              chain.toLowerCase().includes(keyword.toLowerCase())
          );
        }, [type]),
      [keyword, availableChainIds]
    );

    const filteredTestnetChains = filteredChains("testnet");
    const filteredMainnetChains = filteredChains("mainnet");

    const { getPinnedNetworks } = useNetworkStore();
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

    const areAllNetworksEmpty =
      !filteredPinnedNetworks.length &&
      !filteredMainnetChains.length &&
      !filteredTestnetChains.length;

    const [items, setItems] = useState(filteredPinnedNetworks);

    return (
      <DndContext>
        <Accordion
          variant="transparent"
          allowMultiple
          defaultIndex={[0, 1, 2]}
          width="full"
          p={0}
        >
          <AccordionItem hidden={filteredPinnedNetworks.length === 0}>
            <AccordionButton p={0}>
              <Flex mb={4} justifyContent="space-between" w="full">
                <Heading as="h6" variant="h6">
                  Pinned Network
                </Heading>
                <AccordionIcon color="gray.600" />
              </Flex>
            </AccordionButton>
            <AccordionPanel p={0}>
              {/* TODO: sortable network pin */}
              <SortableList
                items={items}
                onChange={setItems}
                renderItem={
                  () => null
                  // <SortableItem id={network.id}>
                  //   {network.id}
                  //   <NetworkCard
                  //     key={network.chainId}
                  //     image={CHAIN_CONFIGS[network.chainId]?.logoUrl}
                  //     chainId={network.chainId}
                  //     isSelected={network.chainId === currentChainId}
                  //   />
                  //   <DragHandle />
                  // </SortableItem>
                }
              />
              {/* <SortableContext items={filteredPinnedNetworks}>
                <Flex direction="column" gap={1}>
                  {filteredPinnedNetworks.map((network) => (
                    <NetworkCard
                      key={network.chainId}
                      image={CHAIN_CONFIGS[network.chainId]?.logoUrl}
                      chainId={network.chainId}
                      isSelected={network.chainId === currentChainId}
                    />
                  ))}
                </Flex>
              </SortableContext> */}
            </AccordionPanel>
          </AccordionItem>
          {filteredPinnedNetworks.length > 0 && (
            <Divider
              borderColor="gray.700"
              pt={filteredPinnedNetworks.length ? 2 : 0}
              mb={4}
            />
          )}
          <AccordionNetworkList
            isHidden={filteredMainnetChains.length === 0}
            title="Mainnet"
            networks={filteredMainnetChains}
            currentChainId={currentChainId}
          />
          {filteredMainnetChains.length > 0 && (
            <Divider
              borderColor="gray.700"
              pt={filteredPinnedNetworks.length ? 2 : 0}
              mb={4}
            />
          )}
          <AccordionNetworkList
            isHidden={filteredTestnetChains.length === 0}
            title="Testnet"
            networks={filteredTestnetChains}
            currentChainId={currentChainId}
          />
        </Accordion>
        {areAllNetworksEmpty && (
          <EmptyState
            my={0}
            imageVariant="empty"
            imageWidth={40}
            textVariant="body2"
            message="No matched result found.
Please check your keyword."
          />
        )}
      </DndContext>
    );
  }
);
