import { Flex, Skeleton, Text } from "@chakra-ui/react";
import Link from "next/link";

import { trackWebsite } from "lib/amplitude";
import { useTierConfig } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { USER_GUIDE_DOCS_LINK } from "lib/data";
import { useLatestBlockLcd } from "lib/services/block";
import { useOverviewsStats } from "lib/services/stats";
import { useAuth } from "lib/hooks";

export const InformationFooter = () => {
  const { auth, signOut, isEnable } = useAuth();
  const { isFullTier } = useTierConfig();
  const { data: overviewsStats, isLoading: isLoadingFull } =
    useOverviewsStats(isFullTier);
  const { data: latestHeight, isLoading: isLoadingLite } = useLatestBlockLcd();

  const handleSignOut = async () => signOut(auth);

  const latest = isFullTier ? overviewsStats?.latestBlock : latestHeight;
  const isLoading = isFullTier ? isLoadingFull : isLoadingLite;

  return (
    <Flex
      direction="column"
      mt={8}
      mb={2}
      alignItems={{ base: "center", md: "start" }}
    >
      <Flex gap={1} py={1} px={2} align="center">
        <CustomIcon name="block" color="gray.600" boxSize={3} />
        {isLoading ? (
          <Skeleton
            h={4}
            w={24}
            borderRadius={8}
            startColor="gray.500"
            endColor="gray.700"
          />
        ) : (
          <>
            <Text variant="body3" color="text.dark">
              {latest ?? "N/A"}
            </Text>
            {latest && (
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
          </>
        )}
      </Flex>
      <Flex flexDirection="column">
        <Link
          key="View Doc"
          href={`${USER_GUIDE_DOCS_LINK}/introduction/overview`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackWebsite(`${USER_GUIDE_DOCS_LINK}/introduction/overview`)
          }
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
            <CustomIcon name="document" color="gray.600" boxSize={3} />
            <Text variant="body3" color="text.dark">
              View Doc
            </Text>
          </Flex>
        </Link>
        {isEnable && (
          <Flex
            gap={1}
            py={1}
            px={2}
            borderRadius={4}
            align="center"
            cursor="pointer"
            _hover={{ background: "gray.800" }}
            transition="all 0.25s ease-in-out"
            onClick={handleSignOut}
          >
            <CustomIcon name="slashed" color="gray.600" boxSize={3} />
            <Text variant="body3" color="text.dark">
              Sign Out
            </Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
