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
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { useNetworkStore } from "lib/providers/store";
import type { Nullable, Option } from "lib/types";

import { NetworkCardDraggable } from "./network-card";

interface NetworkAccodionPinnedProps {
  cursor: Option<number>;
  onClose: () => void;
  pinnedNetworks: string[];
  setCursor: (index: Option<number>) => void;
}

export const NetworkAccodionPinned = observer(
  ({
    cursor,
    onClose,
    pinnedNetworks,
    setCursor,
  }: NetworkAccodionPinnedProps) => {
    const { setPinnedNetworks } = useNetworkStore();
    const [dndActive, setDndActive] = useState<Nullable<Active>>(null);

    // Drag and drop feature
    const activeItem = useMemo(
      () => pinnedNetworks.find((item) => item === dndActive?.id),
      [dndActive, pinnedNetworks]
    );

    const sensors = useSensors(
      useSensor(MouseSensor, {
        activationConstraint: {
          delay: 100,
          tolerance: 5,
        },
      }),
      useSensor(TouchSensor, {
        activationConstraint: {
          delay: 100,
          tolerance: 5,
        },
      })
    );

    return (
      <AccordionItem hidden={pinnedNetworks.length === 0}>
        <Flex gap={4} direction="column">
          <AccordionButton p={0}>
            <Flex w="full" justifyContent="space-between">
              <Heading as="h6" variant="h6">
                Pinned Network
              </Heading>
              <AccordionIcon color="gray.600" />
            </Flex>
          </AccordionButton>
          <AccordionPanel mb={2} p={0}>
            <DndContext
              collisionDetection={closestCenter}
              onDragCancel={() => {
                setDndActive(null);
              }}
              onDragEnd={({ active, over }) => {
                if (over && active.id !== over.id) {
                  const activeIndex = pinnedNetworks.indexOf(
                    active.id.toString()
                  );
                  const overIndex = pinnedNetworks.indexOf(over.id.toString());
                  setPinnedNetworks(
                    arrayMove(pinnedNetworks, activeIndex, overIndex)
                  );
                }
                setDndActive(null);
              }}
              onDragStart={({ active }) => {
                setDndActive(active);
              }}
              sensors={sensors}
            >
              <SortableContext
                items={pinnedNetworks}
                strategy={verticalListSortingStrategy}
              >
                {pinnedNetworks.map((item, index) => (
                  <NetworkCardDraggable
                    key={item}
                    chainId={item}
                    index={index}
                    cursor={cursor}
                    onClose={onClose}
                    setCursor={setCursor}
                  />
                ))}
              </SortableContext>
              {createPortal(
                <DragOverlay
                  zIndex={2000}
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
                      key={activeItem}
                      chainId={activeItem}
                      cursor={cursor}
                      onClose={onClose}
                      setCursor={setCursor}
                    />
                  ) : null}
                </DragOverlay>,
                document.body
              )}
            </DndContext>
          </AccordionPanel>
        </Flex>
      </AccordionItem>
    );
  }
);
