import { Flex, Heading, Box, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";

import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { useUserKey } from "lib/hooks";
import { useContractStore } from "lib/providers/store";
import { dateFromNow } from "lib/utils";

export const RecentActivities = observer(() => {
  const userKey = useUserKey();
  const { getRecentActivities, isHydrated } = useContractStore();
  const navigate = useInternalNavigate();

  const activities = useMemo(() => {
    return getRecentActivities(userKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getRecentActivities, userKey, isHydrated]);

  return (
    <Box py={8}>
      <Heading px={12} as="h5" variant="h5" mb={4}>
        Recent Queries and Executes on this device
      </Heading>
      {activities.length ? (
        <Flex px={12} gap={4} overflowX="scroll" w="100%">
          {activities.map((item) => (
            <Flex
              direction="column"
              gap={3}
              minW="360px"
              cursor="pointer"
              p={6}
              bg="gray.900"
              borderRadius="8px"
              _hover={{ bg: "gray.800" }}
              transition="all .25s ease-in-out"
              key={item.type + item.contractAddress + item.timestamp}
              onClick={() =>
                navigate({
                  pathname: `/${item.type}`,
                  query: { contract: item.contractAddress, msg: item.msg },
                })
              }
            >
              <Flex alignItems="center" gap={1}>
                <CustomIcon
                  name={item.type === "query" ? "query" : "execute"}
                  color="accent.main"
                />
                <Text variant="body2" color="accent.main">
                  {item.type === "query" ? "Query" : "Execute"}
                </Text>
              </Flex>
              <Flex alignItems="center" gap="4px">
                <Text
                  variant="body3"
                  padding="4px 8px"
                  backgroundColor="gray.700"
                  borderRadius="16px"
                >
                  {item.action}
                </Text>
                <Text variant="body3">on</Text>
                <ExplorerLink
                  value={item.contractAddress}
                  type="contract_address"
                  showCopyOnHover
                />
              </Flex>
              <Flex gap={1}>
                <Text variant="body2">{dateFromNow(item.timestamp)}</Text>
                {/* TODO - check address as me */}
                {item.sender && (
                  <>
                    <Text variant="body2">by</Text>
                    <ExplorerLink
                      value={item.sender}
                      type="user_address"
                      showCopyOnHover
                    />
                  </>
                )}
              </Flex>
            </Flex>
          ))}
        </Flex>
      ) : (
        <Flex
          px={12}
          borderTopWidth={1}
          borderBottomWidth={1}
          borderColor="gray.700"
          justifyContent="center"
          alignItems="center"
          minH="128px"
        >
          <Text color="text.dark" variant="body1">
            Your recent interactions will display here.
          </Text>
        </Flex>
      )}
    </Box>
  );
});
