import { track } from "@amplitude/analytics-browser";
import { Flex, Skeleton, Text } from "@chakra-ui/react";
import Link from "next/link";

import { AmpEvent, trackWebsite } from "lib/amplitude";
import { useTierConfig } from "lib/app-provider";
import type { IconKeys } from "lib/components/icon";
import { CustomIcon } from "lib/components/icon";
import { USER_GUIDE_DOCS_LINK } from "lib/data";
import { useLatestBlockLcd } from "lib/services/block";
import { useOverviewsStats } from "lib/services/stats";

const FOOTER_BUTTONS = [
  {
    href: `${USER_GUIDE_DOCS_LINK}/introduction/overview`,
    icon: "document" as IconKeys,
    onClick: () =>
      trackWebsite(`${USER_GUIDE_DOCS_LINK}/introduction/overview`),
    text: "View Doc",
  },
  {
    href: "https://feedback.alleslabs.com",
    icon: "feedback" as IconKeys,
    onClick: () => track(AmpEvent.FEEDBACK),
    text: "Feedback",
  },
];

export const InformationFooter = () => {
  const { isFullTier } = useTierConfig();
  const { data: overviewsStats, isLoading: isLoadingFull } =
    useOverviewsStats(isFullTier);
  const { data: latestHeight, isLoading: isLoadingLite } = useLatestBlockLcd();

  const latest = isFullTier ? overviewsStats?.latestBlock : latestHeight;
  const isLoading = isFullTier ? isLoadingFull : isLoadingLite;

  return (
    <Flex
      alignItems={{ base: "center", md: "start" }}
      mb={2}
      mt={8}
      direction="column"
    >
      <Flex align="center" gap={1} px={2} py={1}>
        <CustomIcon name="block" boxSize={3} color="gray.600" />
        {isLoading ? (
          <Skeleton
            h={4}
            w={24}
            borderRadius={8}
            endColor="gray.700"
            startColor="gray.500"
          />
        ) : (
          <>
            <Text variant="body3" color="text.dark">
              {latest ?? "N/A"}
            </Text>
            {latest && (
              <Flex
                h={2}
                sx={{
                  "@keyframes pulse": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.5 },
                  },
                  animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                }}
                w={2}
                bgColor="success.main"
                borderRadius="16px"
              />
            )}
          </>
        )}
      </Flex>
      <Flex>
        {FOOTER_BUTTONS.map(({ href, icon, onClick, text }) => (
          <Link
            key={text}
            rel="noopener noreferrer"
            target="_blank"
            onClick={onClick}
            href={href}
          >
            <Flex
              align="center"
              gap={1}
              px={2}
              py={1}
              _hover={{ background: "gray.800" }}
              borderRadius={4}
              cursor="pointer"
              transition="all 0.25s ease-in-out"
            >
              <CustomIcon name={icon} boxSize={3} color="gray.600" />
              <Text variant="body3" color="text.dark">
                {text}
              </Text>
            </Flex>
          </Link>
        ))}
      </Flex>
    </Flex>
  );
};
