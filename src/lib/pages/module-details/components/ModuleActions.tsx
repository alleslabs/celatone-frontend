import { Flex, Heading, Text } from "@chakra-ui/react";
import type { MouseEventHandler } from "react";

import { FunctionTypeTabIndex, TabIndex } from "../types";
import { useTierConfig } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import type { IconKeys } from "lib/components/icon";
import type { Option } from "lib/types";

interface ActionInfo {
  count: Option<number>;
  disabled: boolean;
  hidden: Option<boolean>;
  icon: IconKeys;
  iconColor: string;
  name: string;
  onClick: MouseEventHandler<HTMLDivElement>;
}

interface ModuleActionsProps {
  allTxsCount: Option<number>;
  executeFns: number;
  onSelectAction: (nextTab: TabIndex, fnType?: FunctionTypeTabIndex) => void;
  viewFns: number;
}

export const ModuleActions = ({
  allTxsCount,
  executeFns,
  onSelectAction,
  viewFns,
}: ModuleActionsProps) => {
  const { isFullTier } = useTierConfig();

  const actionList: ActionInfo[] = [
    {
      count: viewFns,
      disabled: viewFns === 0,
      hidden: false,
      icon: "query" as IconKeys,
      iconColor: "primary.main",
      name: "View Functions",
      onClick: () =>
        onSelectAction(TabIndex.Function, FunctionTypeTabIndex.VIEW),
    },
    {
      count: executeFns,
      disabled: executeFns === 0,
      hidden: false,
      icon: "execute" as IconKeys,
      iconColor: "secondary.main",
      name: "Execute Functions",
      onClick: () =>
        onSelectAction(TabIndex.Function, FunctionTypeTabIndex.EXECUTE),
    },
    {
      count: allTxsCount,
      disabled: allTxsCount === 0,
      hidden: !isFullTier,
      icon: "list" as IconKeys,
      iconColor: "gray.600",
      name: "Transactions",
      onClick: () => onSelectAction(TabIndex.TxsHistories),
    },
  ];

  return (
    <Flex
      gap={{ base: 2, md: 6 }}
      mb={{ base: 2, md: 6 }}
      direction={{ base: "column", md: "row" }}
      justifyContent="space-between"
    >
      {actionList.map((item) => (
        <Flex
          key={item.name}
          alignItems="center"
          display={item.hidden ? "none" : "flex"}
          p={4}
          w="full"
          borderRadius={8}
          justifyContent="space-between"
          transition="all .25s ease-in-out"
          {...(item.disabled
            ? {
                bg: "gray.900",
                cursor: "not-allowed",
              }
            : {
                _hover: { bg: "gray.700" },
                bg: "gray.800",
                cursor: "pointer",
                onClick: item.onClick,
              })}
        >
          <Flex alignItems="center" gap={3}>
            <CustomIcon name={item.icon} boxSize={6} color={item.iconColor} />
            <Flex flexDirection="column">
              <Text variant="body1" color="text.dark" fontWeight={600}>
                {item.name}
              </Text>
              <Heading as="h6" variant="h6" fontWeight={600}>
                {item.count ?? "N/A"}
              </Heading>
            </Flex>
          </Flex>
          <CustomIcon name="chevron-right" color="gray.600" />
        </Flex>
      ))}
    </Flex>
  );
};
