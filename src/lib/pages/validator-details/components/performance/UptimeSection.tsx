import { Button, Flex, Heading, Text } from "@chakra-ui/react";

import { PenaltyStatus } from "../../types";
import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { ValueWithIcon } from "lib/components/ValueWithIcon";

import { PenaltyStatusSection } from "./PenaltyStatusSection";
import { RecentBlocksLegends } from "./RecentBlocksLegends";
import { RecentBlocksSection } from "./RecentBlocksSection";

interface UptimeSectionProps {
  isDetailPage?: boolean;
  onViewMore?: () => void;
}

export const UptimeSection = ({
  onViewMore,
  isDetailPage = false,
}: UptimeSectionProps) => {
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
          {onViewMore && !isMobile && (
            <Button
              variant="ghost-primary"
              rightIcon={<CustomIcon name="chevron-right" />}
              onClick={onViewMore}
            >
              View Performance
            </Button>
          )}
        </Flex>
        <ValueWithIcon icon="block" value="98.21%" />
      </Flex>
      <RecentBlocksLegends />
      {!isDetailPage && (
        <>
          {isMobile && <RecentBlocksSection />}
          <PenaltyStatusSection hasBorder status={PenaltyStatus.JAILED} />{" "}
        </>
      )}
      {onViewMore && isMobile && (
        <Button
          variant="ghost-primary"
          rightIcon={<CustomIcon name="chevron-right" />}
          onClick={onViewMore}
        >
          View Performance
        </Button>
      )}
    </Flex>
  );
};
