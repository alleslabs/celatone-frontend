import { Flex, Heading, Text } from "@chakra-ui/react";

import { CustomIcon, type IconKeys } from "lib/components/icon";

interface ActionInfo {
  icon: IconKeys;
  iconColor: string;
  name: string;
  count: number;
}

export const QuickAccess = () => {
  const actionList: ActionInfo[] = [
    {
      icon: "query" as IconKeys,
      iconColor: "primary.main",
      name: "View Functions",
      count: 430,
    },
    {
      icon: "execute" as IconKeys,
      iconColor: "accent.main",
      name: "Execute Functions",
      count: 30,
    },
    {
      icon: "list" as IconKeys,
      iconColor: "gray.600",
      name: "Transactions",
      count: 30,
    },
  ];

  return (
    <Flex justifyContent="space-between" gap={6}>
      {actionList.map((item) => (
        // TODO Navigate to tab
        <Flex
          p={4}
          bg="gray.800"
          borderRadius={8}
          w="full"
          alignItems="center"
          justifyContent="space-between"
        >
          <Flex gap={3} alignItems="center">
            <CustomIcon name={item.icon} boxSize={6} color={item.iconColor} />
            <Flex flexDirection="column">
              <Text variant="body1" color="text.dark" fontWeight={600}>
                {item.name}
              </Text>
              <Heading as="h6" variant="h6" fontWeight={600}>
                {item.count}
              </Heading>
            </Flex>
          </Flex>
          <CustomIcon name="chevron-right" color="gray.600" />
        </Flex>
      ))}
    </Flex>
  );
};
