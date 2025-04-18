import type { ValidatorUptimeResponse } from "lib/services/types";
import type { ComputedUptime, Ratio, ValidatorAddr } from "lib/types";

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
import { trackUseUpTime, trackUseViewMore } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { ValueWithIcon } from "lib/components/ValueWithIcon";
import { formatRatio } from "lib/utils";
import { useMemo } from "react";

import { PenaltyEvent } from "./PenaltyEvent";
import { RecentBlocksLegends } from "./RecentBlocksLegends";
import { RecentBlocksSection } from "./RecentBlocksSection";

const SUPPORTED_UPTIME_BLOCKS = [100, 1000, 10000];

interface UptimeSectionProps {
  validatorAddress: ValidatorAddr;
  uptimeData: ValidatorUptimeResponse;
  uptimeBlock: number;
  setUptimeBlock?: (block: number) => void;
  onViewMore?: () => void;
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
      backgroundColor="gray.900"
      direction="column"
      gap={4}
      p={{ base: 4, md: 6 }}
      rounded={8}
      w="100%"
    >
      <Flex direction="column" gap={2}>
        <Flex justifyContent="space-between" w="full">
          <Flex alignItems="center" gap={2}>
            <Heading as="h6" color="text.main" variant="h6">
              Uptime
            </Heading>
            {setUptimeBlock ? (
              <Menu>
                <MenuButton>
                  <Text color="text.dark" variant="body2">
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
              <Text color="text.dark" variant="body2">
                Latest 100 blocks
              </Text>
            )}
          </Flex>
          {onViewMore && !isMobile && (
            <Button
              rightIcon={<CustomIcon name="chevron-right" />}
              variant="ghost-primary"
              onClick={() => {
                trackUseViewMore();
                onViewMore();
              }}
            >
              View performance
            </Button>
          )}
        </Flex>
        <ValueWithIcon icon="block" value={formatRatio(computed.uptimeRatio)} />
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
              rightIcon={<CustomIcon name="chevron-right" />}
              variant="ghost-primary"
              onClick={() => {
                trackUseViewMore();
                onViewMore();
              }}
            >
              View performance
            </Button>
          )}
        </>
      )}
    </Flex>
  );
};
