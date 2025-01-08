import {
  Button,
  Divider,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useMemo } from "react";

import { trackUseUpTime, trackUseViewMore } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { ValueWithIcon } from "lib/components/ValueWithIcon";
import type { ValidatorUptimeResponse } from "lib/services/types";
import type { ComputedUptime, Ratio, ValidatorAddr } from "lib/types";
import { formatRatio } from "lib/utils";

import { PenaltyEvent } from "./PenaltyEvent";
import { RecentBlocksLegends } from "./RecentBlocksLegends";
import { RecentBlocksSection } from "./RecentBlocksSection";

const SUPPORTED_UPTIME_BLOCKS = [100, 1000, 10000];

interface UptimeSectionProps {
  onViewMore?: () => void;
  setUptimeBlock?: (block: number) => void;
  uptimeBlock: number;
  uptimeData: ValidatorUptimeResponse;
  validatorAddress: ValidatorAddr;
}

export const UptimeSection = ({
  onViewMore,
  setUptimeBlock,
  uptimeBlock,
  uptimeData,
  validatorAddress,
}: UptimeSectionProps) => {
  const isMobile = useMobile();

  const computed = useMemo<ComputedUptime>(() => {
    const data = uptimeData.uptime;

    return {
      missed: data.missedBlocks,
      missedRatio: (data.missedBlocks / data.total) as Ratio<number>,
      proposed: data.proposedBlocks,
      proposedRatio: (data.proposedBlocks / data.total) as Ratio<number>,
      signed: data.signedBlocks,
      signedRatio: (data.signedBlocks / data.total) as Ratio<number>,
      uptimeRatio: ((data.signedBlocks + data.proposedBlocks) /
        data.total) as Ratio<number>,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(uptimeData.uptime)]);

  return (
    <Flex
      gap={4}
      p={{ base: 4, md: 6 }}
      w="100%"
      backgroundColor="gray.900"
      direction="column"
      rounded={8}
    >
      <Flex gap={2} direction="column">
        <Flex w="full" justifyContent="space-between">
          <Flex alignItems="center" gap={2}>
            <Heading as="h6" variant="h6" color="text.main">
              Uptime
            </Heading>
            {setUptimeBlock ? (
              <Menu>
                <MenuButton>
                  <Text variant="body2" color="text.dark">
                    Latest {uptimeBlock} Blocks
                    <CustomIcon ml={2} name="chevron-down" />
                  </Text>
                </MenuButton>
                <MenuList>
                  {SUPPORTED_UPTIME_BLOCKS.map((block) => (
                    <MenuItem
                      key={block}
                      onClick={() => {
                        trackUseUpTime({ block: block.toString() });
                        setUptimeBlock(block);
                      }}
                    >
                      Latest {block} Blocks
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            ) : (
              <Text variant="body2" color="text.dark">
                Latest 100 Blocks
              </Text>
            )}
          </Flex>
          {onViewMore && !isMobile && (
            <Button
              variant="ghost-primary"
              onClick={() => {
                trackUseViewMore();
                onViewMore();
              }}
              rightIcon={<CustomIcon name="chevron-right" />}
            >
              View Performance
            </Button>
          )}
        </Flex>
        <ValueWithIcon value={formatRatio(computed.uptimeRatio)} icon="block" />
      </Flex>
      <RecentBlocksLegends uptime={computed} />
      {onViewMore && (
        <>
          {isMobile && (
            <RecentBlocksSection validatorAddress={validatorAddress} />
          )}
          {uptimeData.events.length !== 0 && <Divider />}
          {uptimeData.events.map((event) => (
            <PenaltyEvent key={event.height} event={event} />
          ))}
          {isMobile && (
            <Button
              variant="ghost-primary"
              onClick={() => {
                trackUseViewMore();
                onViewMore();
              }}
              rightIcon={<CustomIcon name="chevron-right" />}
            >
              View Performance
            </Button>
          )}
        </>
      )}
    </Flex>
  );
};
