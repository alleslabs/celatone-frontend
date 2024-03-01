import { Button, Flex, Heading, Text } from "@chakra-ui/react";

import { PenaltyStatus } from "../../types";
import { PenaltyStatusSection } from "../PenaltyStatusSection";
import { RecentBlocksLegends } from "../RecentBlocksLegends";
import { RecentBlocksSection } from "../RecentBlocksSection";
import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { ValueWithIcon } from "lib/components/ValueWithIcon";

interface UptimeOverviewProps {
  onViewMore: () => void;
}

export const UptimeOverview = ({ onViewMore }: UptimeOverviewProps) => {
  const isMobile = useMobile();
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
            <Text variant="body2" color="text.dark">
              Latest 100 Blocks
            </Text>
          </Flex>
          <Button
            display={{ base: "none", md: "flex" }}
            variant="ghost-primary"
            rightIcon={<CustomIcon name="chevron-right" />}
            onClick={onViewMore}
          >
            View Performance
          </Button>
        </Flex>
        <ValueWithIcon icon="block" value="98.21%" />
      </Flex>
      <RecentBlocksLegends />
      {isMobile && <RecentBlocksSection />}
      <PenaltyStatusSection status={PenaltyStatus.JAILED} />
      <Button
        display={{ base: "flex", md: "none" }}
        variant="ghost-primary"
        rightIcon={<CustomIcon name="chevron-right" />}
        onClick={onViewMore}
      >
        View Performance
      </Button>
    </Flex>
  );
};
