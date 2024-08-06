import { Accordion, Button, Divider, Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { useAllowCustomNetworks } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";
import { EmptyState } from "lib/components/state";
import type { Option } from "lib/types";

import { NetworkAccordion } from "./NetworkAccordion";
import { NetworkAccordionLocal } from "./NetworkAccordionLocal";
import { NetworkAccodionPinned } from "./NetworkAccordionPinned";

interface NetworkMenuBodyProps {
  cursor: Option<number>;
  setCursor: (cursor: Option<number>) => void;
  filteredPinnedChains: string[];
  filteredMainnetChains: string[];
  filteredTestnetChains: string[];
  filteredLocalChains: string[];
  onClose: () => void;
}

export const NetworkMenuBody = observer(
  ({
    cursor,
    setCursor,
    filteredPinnedChains,
    filteredMainnetChains,
    filteredTestnetChains,
    filteredLocalChains,
    onClose,
  }: NetworkMenuBodyProps) => {
    const isAllowCustomNetworks = useAllowCustomNetworks({
      shouldRedirect: false,
    });

    return (
      <>
        <Accordion
          variant="transparent"
          allowMultiple
          defaultIndex={[0, 1, 2, 3]}
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
            {!!filteredMainnetChains.length && (
              <Divider borderColor="gray.700" />
            )}
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
            {isAllowCustomNetworks && (
              <>
                <Divider borderColor="gray.700" />
                <NetworkAccordionLocal
                  networks={filteredLocalChains}
                  cursor={cursor}
                  setCursor={setCursor}
                  startIndex={
                    filteredPinnedChains.length +
                    filteredMainnetChains.length +
                    filteredTestnetChains.length
                  }
                  onClose={onClose}
                />
                <AppLink href="/custom-network/add">
                  <Button
                    variant="outline-gray"
                    justifyContent="flex-start"
                    leftIcon={
                      <CustomIcon name="plus" boxSize={4} color="gray.600" />
                    }
                    onClick={onClose}
                    w="full"
                    h={12}
                  >
                    Add custom Minitia
                  </Button>
                </AppLink>
              </>
            )}
          </Flex>
        </Accordion>
        {filteredPinnedChains.length +
          filteredMainnetChains.length +
          filteredTestnetChains.length +
          filteredLocalChains.length ===
          0 && (
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
