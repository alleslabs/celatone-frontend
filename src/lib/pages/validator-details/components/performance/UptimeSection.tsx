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

import { trackUseViewMore } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { ValueWithIcon } from "lib/components/ValueWithIcon";
import type { ValidatorUptimeResponse } from "lib/services/validator";
import type { ComputedUptime, Ratio, ValidatorAddr } from "lib/types";
import { formatRatio } from "lib/utils";

import { PenaltyEvent } from "./PenaltyEvent";
import { RecentBlocksLegends } from "./RecentBlocksLegends";
import { RecentBlocksSection } from "./RecentBlocksSection";

interface UptimeSectionProps {
  validatorAddress: ValidatorAddr;
  uptimeData: ValidatorUptimeResponse;
  uptimeBlock: number;
  setUptimeBlock?: (block: number) => void;
  onViewMore?: () => void;
}

export const UptimeSection = ({
  validatorAddress,
  uptimeData,
  uptimeBlock,
  setUptimeBlock,
  onViewMore,
}: UptimeSectionProps) => {
  const isMobile = useMobile();

  const computed = useMemo<ComputedUptime>(() => {
    const data = uptimeData.uptime;

    return {
      signed: data.signedBlocks,
      proposed: data.proposedBlocks,
      missed: data.missedBlocks,
      signedRatio: (data.signedBlocks / data.total) as Ratio<number>,
      proposedRatio: (data.proposedBlocks / data.total) as Ratio<number>,
      missedRatio: (data.missedBlocks / data.total) as Ratio<number>,
      uptimeRatio: ((data.signedBlocks + data.proposedBlocks) /
        data.total) as Ratio<number>,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(uptimeData.uptime)]);

  const handleOnViewMore = () => {
    if (!onViewMore) return;

    trackUseViewMore();
    onViewMore();
  };

  return (
    <Flex
      direction="column"
      gap={4}
      backgroundColor="gray.900"
      p={{ base: 4, md: 6 }}
      rounded={8}
      w="100%"
    >
      <Flex direction="column" gap={2}>
        <Flex justifyContent="space-between" w="full">
          <Flex alignItems="center" gap={2}>
            <Heading variant="h6" as="h6" color="text.main">
              Uptime
            </Heading>
            {setUptimeBlock ? (
              <Menu>
                <MenuButton>
                  <Text variant="body2" color="text.dark">
                    Latest {uptimeBlock} Blocks
                    <CustomIcon name="chevron-down" ml={2} />
                  </Text>
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => setUptimeBlock(100)}>
                    Latest 100 Blocks
                  </MenuItem>
                  <MenuItem onClick={() => setUptimeBlock(1000)}>
                    Latest 1000 Blocks
                  </MenuItem>
                  <MenuItem onClick={() => setUptimeBlock(10000)}>
                    Latest 10000 Blocks
                  </MenuItem>
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
              rightIcon={<CustomIcon name="chevron-right" />}
              onClick={handleOnViewMore}
            >
              View Performance
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
              variant="ghost-primary"
              rightIcon={<CustomIcon name="chevron-right" />}
              onClick={handleOnViewMore}
            >
              View Performance
            </Button>
          )}
        </>
      )}
    </Flex>
  );
};
