/* eslint-disable sonarjs/cognitive-complexity */
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Divider,
  Flex,
  FormControl,
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { observer } from "mobx-react-lite";
import { useCallback, useMemo, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

import { CHAIN_CONFIGS } from "config/chain";
import { useCelatoneApp, useSelectChain } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import { EmptyState } from "lib/components/state";
import { useNetworkStore } from "lib/providers/store";
import type { Option } from "lib/types";

import { NetworkAccodion } from "./NetworkAccordion";
import { NetworkDragItemWrapper } from "./NetworkDragItemWrapper";

interface NetworkMenuBodyProps {
  currentChainId: string;
  onClose: () => void;
}

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

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
};

export const NetworkMenuBody = observer(
  ({ currentChainId, onClose }: NetworkMenuBodyProps) => {
    const selectChain = useSelectChain();
    const { availableChainIds } = useCelatoneApp();
    const [cursor, setCursor] = useState<number>();
    const [keyword, setKeyword] = useState("");

    // Get chains info
    const filteredChains = useMemo(() => {
      const filterChains = (type: "mainnet" | "testnet") =>
        availableChainIds
          .filter((chain) => CHAIN_CONFIGS[chain]?.networkType === type)
          .filter(
            (network) =>
              !keyword ||
              CHAIN_CONFIGS[network]?.prettyName
                .toLowerCase()
                .includes(keyword.toLowerCase()) ||
              network.toLowerCase().includes(keyword.toLowerCase())
          );
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

    // Drag and drop feature

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

    // Navigate with arrow keys

    const formattedPinnedNetworks = filteredPinnedNetworks.map(
      (x) => x.chainId
    );
    const allNetworks = useMemo(
      () => [
        ...formattedPinnedNetworks,
        ...filteredMainnetChains,
        ...filteredTestnetChains,
      ],
      [formattedPinnedNetworks, filteredMainnetChains, filteredTestnetChains]
    );

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
        <FormControl>
          <InputWithIcon
            placeholder="Search by Name or Chain ID"
            size="md"
            value={keyword}
            autoFocus
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleOnKeyEnter}
            amptrackSection="network-search"
          />
        </FormControl>
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
                {filteredPinnedNetworks.map((item, index) => (
                  <NetworkDragItemWrapper
                    key={item.chainId}
                    chainId={item.chainId}
                    currentChainId={currentChainId}
                    index={index}
                    cursor={cursor}
                    setCursor={setCursor}
                    onClose={onClose}
                  />
                ))}
              </SortableContext>
              <DragOverlay dropAnimation={dropAnimationConfig}>
                {activeItem ? (
                  <NetworkDragItemWrapper
                    key={activeItem.chainId}
                    chainId={activeItem.chainId}
                    currentChainId={currentChainId}
                    cursor={cursor}
                    setCursor={setCursor}
                    onClose={onClose}
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
          <NetworkAccodion
            isHidden={filteredTestnetChains.length === 0}
            title="Testnet"
            normalNetworks={filteredTestnetChains}
            currentChainId={currentChainId}
            cursor={cursor}
            setCursor={setCursor}
            startIndex={
              filteredPinnedNetworks.length + filteredMainnetChains.length
            }
            onClose={onClose}
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
