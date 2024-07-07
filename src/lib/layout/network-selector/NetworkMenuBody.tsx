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
import { useMemo, useState } from "react";

import { CHAIN_CONFIGS } from "config/chain";
import { useCelatoneApp } from "lib/app-provider";
import { EmptyState } from "lib/components/state";
import { useNetworkStore } from "lib/providers/store";

import { NetworkAccodion } from "./NetworkAccordion";
import { NetworkCard } from "./NetworkCard";

interface NetworkMenuBodyProps {
  currentChainId: string;
  keyword: string;
}

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

    const filteredChains = useMemo(() => {
      const filterChains = (type: "mainnet" | "testnet") => {
        return availableChainIds
          .filter((chain) => CHAIN_CONFIGS[chain]?.networkType === type)
          .filter(
            (network) =>
              !keyword ||
              CHAIN_CONFIGS[network]?.prettyName
                .toLowerCase()
                .includes(keyword.toLowerCase()) ||
              network.toLowerCase().includes(keyword.toLowerCase())
          );
      };
      return {
        testnet: filterChains("testnet"),
        mainnet: filterChains("mainnet"),
      };
    }, [availableChainIds, keyword]);

    const filteredTestnetChains = filteredChains.testnet;
    const filteredMainnetChains = filteredChains.mainnet;

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
            <AccordionPanel p={0} mb={2}>
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
          <NetworkAccodion
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
          <NetworkAccodion
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
