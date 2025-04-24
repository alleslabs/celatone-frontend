import type { IconKeys } from "lib/components/icon";
import type { Option } from "lib/types";
import type { MouseEventHandler } from "react";

import { Flex, Heading, Text } from "@chakra-ui/react";
import { useTierConfig } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";

import { FunctionTypeTabIndex, TabIndex } from "../types";

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
      name: "View functions",
      onClick: () =>
        onSelectAction(TabIndex.Function, FunctionTypeTabIndex.VIEW),
    },
    {
      count: executeFns,
      disabled: executeFns === 0,
      hidden: false,
      icon: "execute" as IconKeys,
      iconColor: "secondary.main",
      name: "Execute functions",
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
      direction={{ base: "column", md: "row" }}
      gap={{ base: 2, md: 6 }}
      justifyContent="space-between"
      mb={{ base: 2, md: 6 }}
    >
      {actionList.map((item) => (
        <Flex
          key={item.name}
          alignItems="center"
          borderRadius={8}
          display={item.hidden ? "none" : "flex"}
          justifyContent="space-between"
          p={4}
          transition="all .25s ease-in-out"
          w="full"
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
            <CustomIcon boxSize={6} color={item.iconColor} name={item.icon} />
            <Flex flexDirection="column">
              <Text color="text.dark" fontWeight={600} variant="body1">
                {item.name}
              </Text>
              <Heading as="h6" fontWeight={600} variant="h6">
                {item.count ?? "N/A"}
              </Heading>
            </Flex>
          </Flex>
          <CustomIcon color="gray.600" name="chevron-right" />
        </Flex>
      ))}
    </Flex>
  );
};
