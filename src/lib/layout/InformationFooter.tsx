import type { IconKeys } from "lib/components/icon";

import { Flex, Skeleton, Text } from "@chakra-ui/react";
import { trackWebsite } from "lib/amplitude";
import { useTierConfig } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { USER_GUIDE_DOCS_LINK } from "lib/data";
import { useLatestBlockRest } from "lib/services/block";
import { useOverviewsStats } from "lib/services/stats";
import Link from "next/link";

const FOOTER_BUTTONS = [
  {
    href: `${USER_GUIDE_DOCS_LINK}/introduction/overview`,
    icon: "document" as IconKeys,
    text: "View doc",
    onClick: () =>
      trackWebsite(`${USER_GUIDE_DOCS_LINK}/introduction/overview`),
  },
];

export const InformationFooter = () => {
  const { isFullTier } = useTierConfig();
  const { data: overviewsStats, isLoading: isLoadingFull } =
    useOverviewsStats(isFullTier);
  const { data: latestHeight, isLoading: isLoadingLite } = useLatestBlockRest();

  const latest = isFullTier ? overviewsStats?.latestBlock : latestHeight;
  const isLoading = isFullTier ? isLoadingFull : isLoadingLite;

  return (
    <Flex
      alignItems={{ base: "center", md: "start" }}
      direction="column"
      mb={2}
      mt={8}
    >
      <Flex align="center" gap={1} px={2} py={1}>
        <CustomIcon boxSize={3} color="gray.600" name="block" />
        {isLoading ? (
          <Skeleton
            borderRadius={8}
            endColor="gray.700"
            h={4}
            startColor="gray.500"
            w={24}
          />
        ) : (
          <>
            <Text color="text.dark" variant="body3">
              {latest ?? "N/A"}
            </Text>
            {latest && (
              <Flex
                bgColor="success.main"
                borderRadius="16px"
                h={2}
                sx={{
                  animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                  "@keyframes pulse": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.5 },
                  },
                }}
                w={2}
              />
            )}
          </>
        )}
      </Flex>
      <Flex>
        {FOOTER_BUTTONS.map(({ href, icon, text, onClick }) => (
          <Link
            key={text}
            href={href}
            rel="noopener noreferrer"
            target="_blank"
            onClick={onClick}
          >
            <Flex
              _hover={{ background: "gray.800" }}
              align="center"
              borderRadius={4}
              cursor="pointer"
              gap={1}
              px={2}
              py={1}
              transition="all 0.25s ease-in-out"
            >
              <CustomIcon boxSize={3} color="gray.600" name={icon} />
              <Text color="text.dark" variant="body3">
                {text}
              </Text>
            </Flex>
          </Link>
        ))}
      </Flex>
    </Flex>
  );
};
