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
import type { Active, DragEndEvent, DropAnimation } from "@dnd-kit/core";
import {
  closestCenter,
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { observer } from "mobx-react-lite";
import { useCallback, useMemo, useState } from "react";

import { CHAIN_CONFIGS } from "config/chain";
import { useCelatoneApp } from "lib/app-provider";
import { EmptyState } from "lib/components/state";
import { useNetworkStore } from "lib/providers/store";

import { NetworkCard } from "./NetworkCard";

interface AccordionNetworkListProps {
  title: string;
  normalNetworks: string[];
  l1Networks?: string[];
  l2Networks?: string[];
  currentChainId: string;
  isHidden?: boolean;
  isMove?: boolean;
}

interface NetworkMenuBodyProps {
  currentChainId: string;
  keyword: string;
}

const AccordionNetworkList = ({
  title,
  normalNetworks,
  l1Networks,
  l2Networks,
  currentChainId,
  isHidden = false,
  isMove = false,
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
      {isMove ? (
        <>
          {l1Networks && (
            <Flex direction="column" gap={1}>
              {l1Networks.map((chainId) => (
                <NetworkCard
                  key={chainId}
                  image={CHAIN_CONFIGS[chainId]?.logoUrl}
                  chainId={chainId}
                  isSelected={chainId === currentChainId}
                />
              ))}
            </Flex>
          )}
          {l2Networks && (
            <Flex direction="column" gap={1}>
              {l2Networks.map((chainId) => (
                <NetworkCard
                  key={chainId}
                  image={CHAIN_CONFIGS[chainId]?.logoUrl}
                  chainId={chainId}
                  isSelected={chainId === currentChainId}
                />
              ))}
            </Flex>
          )}
        </>
      ) : (
        <Flex direction="column" gap={1}>
          {normalNetworks.map((chainId) => (
            <NetworkCard
              key={chainId}
              image={CHAIN_CONFIGS[chainId]?.logoUrl}
              chainId={chainId}
              isSelected={chainId === currentChainId}
            />
          ))}
        </Flex>
      )}
    </AccordionPanel>
  </AccordionItem>
);

export const ItemTypes = {
  CARD: "card",
};

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
};

const SortableItem = ({
  chainId,
  currentChainId,
}: {
  chainId: string;
  currentChainId: string;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: chainId,
  });

  const style = {
    opacity: isDragging ? 0.7 : undefined,
    cursor: isDragging ? "grabbing" : "grab",
    transform: transform ? CSS.Transform.toString(transform) : "none",
    transition: transition || "transform 250ms ease",
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => e.stopPropagation()}
    >
      <NetworkCard
        isDraggable
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

    const { getPinnedNetworks, setPinnedNetworks } = useNetworkStore();
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

    const [dndActive, setDndActive] = useState<Active | null>(null);

    const activeItem = useMemo(
      () => filteredPinnedNetworks.find((item) => item.id === dndActive?.id),
      [dndActive, filteredPinnedNetworks]
    );

    const sensors = useSensors(
      useSensor(MouseSensor, {
        activationConstraint: {
          delay: 100,
          tolerance: 5,
        },
      }),
      useSensor(TouchSensor)
    );

    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.id !== over?.id) {
        setPinnedNetworks(active.id.toString(), over?.id.toString());
      }
    };

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={({ active }) => {
          setDndActive(active);
        }}
        onDragEnd={handleDragEnd}
        onDragCancel={() => {
          setDndActive(null);
        }}
      >
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
              <SortableContext
                items={filteredPinnedNetworks.map((item) => item.chainId)}
                strategy={verticalListSortingStrategy}
              >
                {filteredPinnedNetworks.map((item) => (
                  <SortableItem
                    key={item.chainId}
                    chainId={item.chainId}
                    currentChainId={currentChainId}
                  />
                ))}
              </SortableContext>
              <DragOverlay dropAnimation={dropAnimationConfig}>
                {activeItem ? (
                  <SortableItem
                    key={activeItem.chainId}
                    chainId={activeItem.chainId}
                    currentChainId={currentChainId}
                  />
                ) : null}
              </DragOverlay>
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
            normalNetworks={filteredMainnetChains}
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
            normalNetworks={filteredTestnetChains}
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
