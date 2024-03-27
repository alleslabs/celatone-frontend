import { track } from "@amplitude/analytics-browser";
import { Flex, Skeleton, Text } from "@chakra-ui/react";
import Link from "next/link";

import { AmpEvent } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import { useOverviewsStats } from "lib/services/overviewService";

export const InformationFooter = () => {
  const { data: overviewsStats, isLoading } = useOverviewsStats();

  return (
    <Flex direction={{ base: "row", md: "column" }} mt={8} mb={2}>
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
            {overviewsStats?.latestBlock.toString()}
          </Text>
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
        </Flex>
      )}
      <Flex>
        <Link
          href="https://docs.alleslabs.com/user-guide/introduction/user-introduction"
          target="_blank"
          rel="noopener noreferrer"
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
        <Link
          href="https://feedback.alleslabs.com"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track(AmpEvent.FEEDBACK)}
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
            <CustomIcon name="feedback" color="gray.600" boxSize={3} />
            <Text variant="body3" color="text.dark">
              Feedback
            </Text>
          </Flex>
        </Link>
      </Flex>
    </Flex>
  );
};
