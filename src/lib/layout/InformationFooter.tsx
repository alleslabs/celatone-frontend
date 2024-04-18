import { track } from "@amplitude/analytics-browser";
import { Flex, Skeleton, Text } from "@chakra-ui/react";
import Link from "next/link";

import { AmpEvent, trackWebsite } from "lib/amplitude";
import type { IconKeys } from "lib/components/icon";
import { CustomIcon } from "lib/components/icon";
import { USER_GUIDE_DOCS_LINK } from "lib/data";
import { useOverviewsStats } from "lib/services/overviewService";

const FOOTER_BUTTONS = [
  {
    href: `${USER_GUIDE_DOCS_LINK}/introduction/overview`,
    icon: "document" as IconKeys,
    text: "View Doc",
    onClick: () =>
      trackWebsite(`${USER_GUIDE_DOCS_LINK}/introduction/overview`),
  },
  {
    href: "https://feedback.alleslabs.com",
    icon: "feedback" as IconKeys,
    text: "Feedback",
    onClick: () => track(AmpEvent.FEEDBACK),
  },
];

export const InformationFooter = () => {
  const { data: overviewsStats, isLoading } = useOverviewsStats();

  return (
    <Flex
      direction="column"
      mt={8}
      mb={2}
      alignItems={{ base: "center", md: "start" }}
    >
      {isLoading ? (
        <Skeleton
          ml={2}
          h={4}
          w={24}
          borderRadius={8}
          startColor="gray.500"
          endColor="gray.700"
        />
      ) : (
        <Flex gap={1} py={1} px={2} align="center">
          <CustomIcon name="block" color="gray.600" boxSize={3} />
          <Text variant="body3" color="text.dark">
            {overviewsStats?.latestBlock ?? "N/A"}
          </Text>
          {overviewsStats && (
            <Flex
              w={2}
              h={2}
              bgColor="success.main"
              borderRadius="16px"
              sx={{
                animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1 },
                  "50%": { opacity: 0.5 },
                },
              }}
            />
          )}
        </Flex>
      )}
      <Flex>
        {FOOTER_BUTTONS.map(({ href, icon, text, onClick }) => (
          <Link
            key={text}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClick}
          >
            <Flex
              gap={1}
              py={1}
              px={2}
              borderRadius={4}
              align="center"
              cursor="pointer"
              _hover={{ background: "gray.800" }}
              transition="all 0.25s ease-in-out"
            >
              <CustomIcon name={icon} color="gray.600" boxSize={3} />
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
