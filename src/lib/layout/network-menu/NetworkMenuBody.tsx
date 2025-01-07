import { Accordion, Button, Divider, Flex, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { useAllowCustomNetworks, useMobile } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";
import { EmptyState } from "lib/components/state";
import type { Option } from "lib/types";

import { NetworkAccordion } from "./NetworkAccordion";
import { NetworkAccordionLocal } from "./NetworkAccordionLocal";
import { NetworkAccodionPinned } from "./NetworkAccordionPinned";

interface NetworkMenuBodyProps {
  cursor: Option<number>;
  filteredDevnetChains: string[];
  filteredLocalChains: string[];
  filteredMainnetChains: string[];
  filteredPinnedChains: string[];
  filteredTestnetChains: string[];
  onClose: () => void;
  setCursor: (cursor: Option<number>) => void;
}

export const NetworkMenuBody = observer(
  ({
    cursor,
    filteredDevnetChains,
    filteredLocalChains,
    filteredMainnetChains,
    filteredPinnedChains,
    filteredTestnetChains,
    onClose,
    setCursor,
  }: NetworkMenuBodyProps) => {
    const isAllowCustomNetworks = useAllowCustomNetworks({
      shouldRedirect: false,
    });

    const isMobile = useMobile();

    return (
      <>
        <Accordion
          defaultIndex={[0, 1, 2, 3, 4]}
          p={0}
          variant="transparent"
          allowMultiple
        >
          <Flex gap={4} direction="column">
            <NetworkAccodionPinned
              cursor={cursor}
              onClose={onClose}
              pinnedNetworks={filteredPinnedChains}
              setCursor={setCursor}
            />
            {!!filteredPinnedChains.length && (
              <Divider borderColor="gray.700" />
            )}
            <NetworkAccordion
              startIndex={filteredPinnedChains.length}
              title="Mainnet"
              cursor={cursor}
              networks={filteredMainnetChains}
              onClose={onClose}
              setCursor={setCursor}
            />
            {!!filteredMainnetChains.length && (
              <Divider borderColor="gray.700" />
            )}
            <NetworkAccordion
              startIndex={
                filteredPinnedChains.length + filteredMainnetChains.length
              }
              title="Testnet"
              cursor={cursor}
              networks={filteredTestnetChains}
              onClose={onClose}
              setCursor={setCursor}
            />
            {!!filteredDevnetChains.length && (
              <Divider borderColor="gray.700" />
            )}
            <NetworkAccordion
              startIndex={
                filteredPinnedChains.length +
                filteredMainnetChains.length +
                filteredTestnetChains.length
              }
              title="Devnet"
              cursor={cursor}
              networks={filteredDevnetChains}
              onClose={onClose}
              setCursor={setCursor}
            />
            {isAllowCustomNetworks && (
              <>
                <Divider borderColor="gray.700" />
                <NetworkAccordionLocal
                  startIndex={
                    filteredPinnedChains.length +
                    filteredMainnetChains.length +
                    filteredTestnetChains.length +
                    filteredDevnetChains.length
                  }
                  cursor={cursor}
                  networks={filteredLocalChains}
                  onClose={onClose}
                  setCursor={setCursor}
                />
                {isMobile ? (
                  <Flex
                    px={4}
                    py={2}
                    backgroundColor="gray.900"
                    borderRadius={8}
                    justifyContent="center"
                  >
                    <Text variant="body3" color="text.dark">
                      You can add Custom Minitia on Desktop only
                    </Text>
                  </Flex>
                ) : (
                  <AppLink href="/custom-network/add">
                    <Button
                      h={12}
                      variant="outline-gray"
                      w="full"
                      justifyContent="flex-start"
                      leftIcon={
                        <CustomIcon name="plus" boxSize={4} color="gray.600" />
                      }
                      onClick={onClose}
                    >
                      Add custom Minitia
                    </Button>
                  </AppLink>
                )}
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
            imageWidth={40}
            imageVariant="empty"
            message="No matched result found.
Please check your keyword."
            my={0}
            textVariant="body2"
          />
        )}
      </>
    );
  }
);
