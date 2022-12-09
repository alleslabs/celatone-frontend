import { Flex, Heading, Box, Text, Icon } from "@chakra-ui/react";
import dayjs from "dayjs";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useMemo } from "react";
import { MdSearch, MdInput } from "react-icons/md";

import { useContractStore, useUserKey } from "lib/hooks";
import { truncate } from "lib/utils";

export const RecentActivities = observer(() => {
  const userKey = useUserKey();
  const { getRecentActivities, isHydrated } = useContractStore();

  const activities = useMemo(() => {
    return getRecentActivities(userKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getRecentActivities, userKey, isHydrated]);

  return (
    <Box py={8}>
      <Heading px={12} as="h6" variant="h6" mb={4}>
        Recent Activities on this device
      </Heading>
      {activities.length ? (
        <Flex px={12} gap={4} overflowX="scroll" w="100%">
          {activities.map((item) => (
            <Link
              href={`/${item.type}?contract=${item.contractAddress}&msg=${item.msg}`}
              key={item.type + item.contractAddress + item.timestamp}
            >
              <Flex
                direction="column"
                gap={3}
                minW="320px"
                p={6}
                bg="gray.900"
                borderRadius="8px"
                _hover={{ bg: "hover.main" }}
                transition="all .25s ease-in-out"
              >
                <Flex alignItems="center" gap={1}>
                  <Icon
                    as={item.type === "query" ? MdSearch : MdInput}
                    color="gray.600"
                    boxSize={4}
                  />
                  <Text variant="body2" color="text.dark">
                    {item.type === "query" ? "Query" : "Execute"}
                  </Text>
                </Flex>
                <Flex alignItems="center" gap="4px">
                  <Text
                    variant="body3"
                    color="text.main"
                    padding="4px 8px"
                    backgroundColor="hover.main"
                    borderRadius="16px"
                  >
                    {item.action}
                  </Text>
                  <Text variant="body3">on</Text>
                  <Text variant="body3" color="primary.main">
                    {truncate(item.contractAddress)}
                  </Text>
                </Flex>
                <Text variant="body2" color="text.main">
                  {dayjs(item.timestamp).toNow(true)} ago{" "}
                  {item.sender && `by ${truncate(item.sender)}`}
                </Text>
              </Flex>
            </Link>
          ))}
        </Flex>
      ) : (
        <Flex
          px={12}
          borderTopWidth={1}
          borderBottomWidth={1}
          justifyContent="center"
          alignItems="center"
          minH="128px"
        >
          <Text color="text.dark" variant="body1">
            Your recent queries will display here.
          </Text>
        </Flex>
      )}
    </Box>
  );
});
