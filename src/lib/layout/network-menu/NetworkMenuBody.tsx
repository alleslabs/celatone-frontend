import type { Option } from "lib/types";

import { Accordion, Button, Divider, Flex, Text } from "@chakra-ui/react";
import { useAllowCustomNetworks, useMobile } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";
import { EmptyState } from "lib/components/state";
import { observer } from "mobx-react-lite";

import { NetworkAccordion } from "./NetworkAccordion";
import { NetworkAccordionLocal } from "./NetworkAccordionLocal";
import { NetworkAccodionPinned } from "./NetworkAccordionPinned";

interface NetworkMenuBodyProps {
  cursor: Option<number>;
  setCursor: (cursor: Option<number>) => void;
  filteredPinnedChains: string[];
  filteredMainnetChains: string[];
  filteredTestnetChains: string[];
  filteredDevnetChains: string[];
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
    filteredDevnetChains,
    filteredLocalChains,
    onClose,
  }: NetworkMenuBodyProps) => {
    const isAllowCustomNetworks = useAllowCustomNetworks({
      shouldRedirect: false,
    });

    const isMobile = useMobile();

    return (
      <>
        <Accordion
          allowMultiple
          defaultIndex={[0, 1, 2, 3, 4]}
          p={0}
          variant="transparent"
        >
          <Flex direction="column" gap={4}>
            <NetworkAccodionPinned
              cursor={cursor}
              pinnedNetworks={filteredPinnedChains}
              setCursor={setCursor}
              onClose={onClose}
            />
            {!!filteredPinnedChains.length && (
              <Divider borderColor="gray.700" />
            )}
            <NetworkAccordion
              cursor={cursor}
              networks={filteredMainnetChains}
              setCursor={setCursor}
              startIndex={filteredPinnedChains.length}
              title="Mainnet"
              onClose={onClose}
            />
            {!!filteredMainnetChains.length && (
              <Divider borderColor="gray.700" />
            )}
            <NetworkAccordion
              cursor={cursor}
              networks={filteredTestnetChains}
              setCursor={setCursor}
              startIndex={
                filteredPinnedChains.length + filteredMainnetChains.length
              }
              title="Testnet"
              onClose={onClose}
            />
            {!!filteredDevnetChains.length && (
              <Divider borderColor="gray.700" />
            )}
            <NetworkAccordion
              cursor={cursor}
              networks={filteredDevnetChains}
              setCursor={setCursor}
              startIndex={
                filteredPinnedChains.length +
                filteredMainnetChains.length +
                filteredTestnetChains.length
              }
              title="Devnet"
              onClose={onClose}
            />
            {isAllowCustomNetworks && (
              <>
                <Divider borderColor="gray.700" />
                <NetworkAccordionLocal
                  cursor={cursor}
                  networks={filteredLocalChains}
                  setCursor={setCursor}
                  startIndex={
                    filteredPinnedChains.length +
                    filteredMainnetChains.length +
                    filteredTestnetChains.length +
                    filteredDevnetChains.length
                  }
                  onClose={onClose}
                />
                {isMobile ? (
                  <Flex
                    backgroundColor="gray.900"
                    borderRadius={8}
                    justifyContent="center"
                    px={4}
                    py={2}
                  >
                    <Text variant="body3" color="text.dark">
                      You can add custom rollup on Desktop only
                    </Text>
                  </Flex>
                ) : (
                  <AppLink href="/custom-network/add">
                    <Button
                      h={12}
                      justifyContent="flex-start"
                      leftIcon={
                        <CustomIcon boxSize={4} color="gray.600" name="plus" />
                      }
                      variant="outline-gray"
                      w="full"
                      onClick={onClose}
                    >
                      Add custom rollup
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
            imageVariant="empty"
            imageWidth={40}
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
