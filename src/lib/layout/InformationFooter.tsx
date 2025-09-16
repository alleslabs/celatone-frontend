import type { IconKeys } from "lib/components/icon";

import { Box, Flex, Skeleton, Text } from "@chakra-ui/react";
import { trackWebsite } from "lib/amplitude";
import { useCelatoneApp, useInitiaL1, useTierConfig } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { INITIA_WEBSITE_URL, USER_GUIDE_DOCS_LINK } from "lib/data";
import { useLatestBlockRest } from "lib/services/block";
import { useChainProfile } from "lib/services/chain-config";
import { useOverviewsStats } from "lib/services/stats";
import Link from "next/link";
import { useMemo } from "react";

const FOOTER_BUTTONS = [
  {
    href: `${USER_GUIDE_DOCS_LINK}/introduction/overview`,
    icon: "document" as IconKeys,
    text: "View doc",
  },
];

export const InformationFooter = () => {
  const { isFullTier } = useTierConfig();
  const isInitiaL1 = useInitiaL1({ shouldRedirect: false });
  const {
    chainConfig: { prettyName },
  } = useCelatoneApp();
  const { data: chainProfile } = useChainProfile();
  const { data: overviewsStats, isLoading: isLoadingFull } =
    useOverviewsStats(isFullTier);
  const { data: latestHeight, isLoading: isLoadingLite } = useLatestBlockRest();

  const latest = isFullTier ? overviewsStats?.latestBlock : latestHeight;
  const isLoading = isFullTier ? isLoadingFull : isLoadingLite;

  const footerButtons = useMemo(() => {
    const website = isInitiaL1
      ? INITIA_WEBSITE_URL
      : chainProfile?.[prettyName]?.social?.website;

    if (!website) return FOOTER_BUTTONS;

    return [
      ...FOOTER_BUTTONS,
      {
        href: website,
        icon: "website" as IconKeys,
        text: `Visit ${prettyName}`,
      },
    ];
  }, [chainProfile, isInitiaL1, prettyName]);

  return (
    <Flex direction="column" mb={2} mt={8}>
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
                  "@keyframes pulse": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.5 },
                  },
                  animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                }}
                w={2}
              />
            )}
          </>
        )}
      </Flex>
      <Box>
        {footerButtons.map(({ href, icon, text }) => (
          <Link
            key={text}
            href={href}
            rel="noopener noreferrer"
            target="_blank"
            onClick={() => trackWebsite(href)}
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
      </Box>
    </Flex>
  );
};
