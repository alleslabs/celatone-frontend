import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Heading,
} from "@chakra-ui/react";
import type { Active } from "@dnd-kit/core";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMemo, useState } from "react";

import { useCelatoneApp } from "lib/app-provider";
import { useNetworkStore } from "lib/providers/store";
import type { Network } from "lib/stores/networks";
import type { Nullable, Option } from "lib/types";

import { NetworkCardDraggable } from "./network-card";

interface NetworkAccodionPinnedProps {
  pinnedNetworks: Network[];
  cursor: Option<number>;
  setCursor: (index: Option<number>) => void;
  onClose: () => void;
}

export const NetworkAccodionPinned = ({
  pinnedNetworks,
  cursor,
  setCursor,
  onClose,
}: NetworkAccodionPinnedProps) => {
  const { currentChainId } = useCelatoneApp();
  const { setPinnedNetworks } = useNetworkStore();
  const [dndActive, setDndActive] = useState<Nullable<Active>>(null);

  // Drag and drop feature
  const activeItem = useMemo(
    () => pinnedNetworks.find((item) => item.id === dndActive?.id),
    [dndActive, pinnedNetworks]
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

  return (
    <AccordionItem hidden={pinnedNetworks.length === 0}>
      <AccordionButton p={0}>
        <Flex mb={4} justifyContent="space-between" w="full">
          <Heading as="h6" variant="h6">
            Pinned Network
          </Heading>
          <AccordionIcon color="gray.600" />
        </Flex>
      </AccordionButton>
      <AccordionPanel p={0} mb={2}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={({ active }) => {
            setDndActive(active);
          }}
          onDragEnd={({ active, over }) => {
            if (over && active.id !== over.id) {
              setPinnedNetworks(active.id.toString(), over.id.toString());
            }
            setDndActive(null);
          }}
          onDragCancel={() => {
            setDndActive(null);
          }}
        >
          <SortableContext
            items={pinnedNetworks.map((item) => item.chainId)}
            strategy={verticalListSortingStrategy}
          >
            {pinnedNetworks.map((item, index) => (
              <NetworkCardDraggable
                key={item.chainId}
                chainId={item.chainId}
                isSelected={item.chainId === currentChainId}
                index={index}
                cursor={cursor}
                setCursor={setCursor}
                onClose={onClose}
              />
            ))}
          </SortableContext>
          <DragOverlay
            dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({
                styles: {
                  active: {
                    opacity: "0.4",
                  },
                },
              }),
            }}
          >
            {activeItem ? (
              <NetworkCardDraggable
                key={activeItem.chainId}
                chainId={activeItem.chainId}
                isSelected={activeItem.chainId === currentChainId}
                cursor={cursor}
                setCursor={setCursor}
                onClose={onClose}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </AccordionPanel>
    </AccordionItem>
  );
};
