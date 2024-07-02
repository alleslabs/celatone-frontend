import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Flex,
  Heading,
} from "@chakra-ui/react";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { findIndex } from "lodash";
import { observer } from "mobx-react-lite";
import { useCallback, useMemo, useState } from "react";

import { CHAIN_CONFIGS } from "config/chain";
import { useCelatoneApp } from "lib/app-provider";
import { EmptyState } from "lib/components/state";
import { useNetworkStore } from "lib/providers/store";

import { NetworkCard } from "./NetworkCard";

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

const SortableItem = ({
  chainId,
  currentChainId,
}: {
  chainId: string;
  currentChainId: string;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: chainId,
    });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : "none",
    transition: transition || "transform 250ms ease",
  };

  return (
    <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <NetworkCard
        image={CHAIN_CONFIGS[chainId]?.logoUrl}
        chainId={chainId}
        isSelected={chainId === currentChainId}
      />
    </Box>
  );
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

    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );

    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.id !== over?.id) {
        setItems((newItems) => {
          const oldIndex = findIndex(
            items,
            (item) => item.chainId === active.id
          );
          const newIndex = findIndex(
            items,
            (item) => item.chainId === over?.id
          );
          return arrayMove(newItems, oldIndex, newIndex);
        });
      }
    };

    return (
      <>
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
              {/* // TODO: Implement DND */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={items}
                  strategy={verticalListSortingStrategy}
                >
                  {items.map((item) => (
                    <SortableItem
                      key={item.chainId}
                      chainId={item.chainId}
                      currentChainId={currentChainId}
                    />
                  ))}
                </SortableContext>
              </DndContext>
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
      </>
    );
  }
);
