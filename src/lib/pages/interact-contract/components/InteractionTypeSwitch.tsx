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

  /**
   * @todos current implementation of sliding box dimensions and position is hardcoded due to issues with ref, improve this later
   */
  return (
    <div style={{ marginLeft: ml }}>
      <Flex
        border="1px solid var(--chakra-colors-gray-700)"
        borderRadius="4px"
        p={1}
        direction="row"
        align="center"
        position="relative"
        sx={{ ...(disabled ? { pointerEvents: "none", opacity: 0.3 } : {}) }}
      >
        {tabs.map((tab) => (
          <MotionBox
            key={tab}
            cursor="pointer"
            p="2px 10px"
            w="96px"
            fontSize="12px"
            fontWeight={700}
            variants={{
              active: { color: "var(--chakra-colors-text-main)" },
              inactive: {
                color: "var(--chakra-colors-primary-light)",
              },
            }}
            initial="inactive"
            animate={currentTab === tab ? "active" : "inactive"}
            onClick={() => onTabChange(tab as T)}
            zIndex={1}
            textAlign="center"
            textTransform="capitalize"
          >
            {tab}
          </MotionBox>
        ))}
        <MotionBox
          w="96px"
          h="22px"
          position="absolute"
          borderRadius="2px"
          backgroundColor="primary.darker"
          animate={{
            left: activeIndex === 0 ? "4px" : "100px",
          }}
          transition={{
            type: "spring",
            stiffness: "250",
            damping: "30",
          }}
        />
      </Flex>
    </div>
  );
};
