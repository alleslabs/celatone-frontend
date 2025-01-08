import { Flex } from "@chakra-ui/react";
import { useCallback } from "react";
import type { CSSProperties } from "react";

import { MotionBox } from "lib/components/MotionBox";
import { ContractInteractionTabs } from "lib/types";
import type { Option } from "lib/types";

interface InteractionTypeSwitchProps<
  T extends Option<ContractInteractionTabs>,
> {
  currentTab: T;
  disabled?: boolean;
  ml?: CSSProperties["marginLeft"];
  onTabChange: (newType: T) => void;
}

export const InteractionTypeSwitch = <
  T extends Option<ContractInteractionTabs>,
>({
  currentTab,
  disabled = false,
  ml,
  onTabChange: onTabChangeProps,
}: InteractionTypeSwitchProps<T>) => {
  const tabs: T[] = Object.values(ContractInteractionTabs) as T[];
  const activeIndex = currentTab ? tabs.indexOf(currentTab) : 0;

  const onTabChange = useCallback(
    (tab: T) => {
      onTabChangeProps(tab);
    },
    [onTabChangeProps]
  );

  // TODO: current implementation of sliding box dimensions and position is hardcoded due to issues with ref, improve this later
  return (
    <div style={{ marginLeft: ml }}>
      <Flex
        align="center"
        p={1}
        sx={{ ...(disabled ? { opacity: 0.3, pointerEvents: "none" } : {}) }}
        border="1px solid var(--chakra-colors-gray-700)"
        borderRadius="4px"
        direction="row"
        position="relative"
      >
        {tabs.map((tab) => (
          <MotionBox
            key={tab}
            animate={currentTab === tab ? "active" : "inactive"}
            initial="inactive"
            p="2px 10px"
            textAlign="center"
            variants={{
              active: { color: "var(--chakra-colors-text-main)" },
              inactive: {
                color: "var(--chakra-colors-primary-light)",
              },
            }}
            w="96px"
            zIndex={1}
            cursor="pointer"
            fontSize="12px"
            fontWeight={700}
            onClick={() => onTabChange(tab as T)}
            textTransform="capitalize"
          >
            {tab}
          </MotionBox>
        ))}
        <MotionBox
          animate={{
            left: activeIndex === 0 ? "4px" : "100px",
          }}
          h="22px"
          w="96px"
          backgroundColor="primary.darker"
          borderRadius="2px"
          position="absolute"
          transition={{
            damping: "30",
            stiffness: "250",
            type: "spring",
          }}
        />
      </Flex>
    </div>
  );
};
