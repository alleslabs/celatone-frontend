import { Flex, Heading, Text } from "@chakra-ui/react";
import type { MouseEventHandler } from "react";

import { TabIndex } from "../types";
import { useTierConfig } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import type { IconKeys } from "lib/components/icon";
import type { Option } from "lib/types";

import { FunctionTypeTabs } from "./module-fns";

interface ActionInfo {
  icon: IconKeys;
  iconColor: string;
  name: string;
  count: Option<number>;
  onClick: MouseEventHandler<HTMLDivElement>;
  disabled: boolean;
  hidden: Option<boolean>;
}

interface ModuleActionsProps {
  viewFns: number;
  executeFns: number;
  allTxsCount: Option<number>;
  onSelectAction: (nextTab: TabIndex, fnType?: FunctionTypeTabs) => void;
}

export const ModuleActions = ({
  viewFns,
  executeFns,
  allTxsCount,
  onSelectAction,
}: ModuleActionsProps) => {
  const isFulTier = useTierConfig() === "full";

  const actionList: ActionInfo[] = [
    {
      icon: "query" as IconKeys,
      iconColor: "primary.main",
      name: "View Functions",
      count: viewFns,
      onClick: () => onSelectAction(TabIndex.Function, FunctionTypeTabs.VIEW),
      disabled: viewFns === 0,
      hidden: false,
    },
    {
      icon: "execute" as IconKeys,
      iconColor: "accent.main",
      name: "Execute Functions",
      count: executeFns,
      onClick: () =>
        onSelectAction(TabIndex.Function, FunctionTypeTabs.EXECUTE),
      disabled: executeFns === 0,
      hidden: false,
    },
    {
      icon: "list" as IconKeys,
      iconColor: "gray.600",
      name: "Transactions",
      count: allTxsCount,
      onClick: () => onSelectAction(TabIndex.TxsHistories),
      disabled: allTxsCount === 0,
      hidden: !isFulTier,
    },
  ];

  return (
    <Flex
      justifyContent="space-between"
      direction={{ base: "column", md: "row" }}
      gap={{ base: 2, md: 6 }}
      mb={{ base: 2, md: 6 }}
    >
      {actionList.map((item) => (
        <Flex
          key={item.name}
          p={4}
          transition="all .25s ease-in-out"
          borderRadius={8}
          w="full"
          alignItems="center"
          justifyContent="space-between"
          display={item.hidden ? "none" : "flex"}
          {...(item.disabled
            ? {
                bg: "gray.900",
                cursor: "not-allowed",
              }
            : {
                bg: "gray.800",
                _hover: { bg: "gray.700" },
                cursor: "pointer",
                onClick: item.onClick,
              })}
        >
          <Flex gap={3} alignItems="center">
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
