import type { FlexProps } from "@chakra-ui/react";
import { Flex, Heading } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { MotionBox } from "lib/components/MotionBox";
import type { Option } from "lib/types";

export enum InteractionTabs {
  EXECUTE_MODULE = "Execute",
  VIEW_MODULE = "View",
}

interface InteractionTypeSwitchProps extends FlexProps {
  counts: [Option<number>, Option<number>];
  currentTab: InteractionTabs;
  disabled?: boolean;
  onTabChange: Dispatch<SetStateAction<InteractionTabs>>;
}

const tabs = Object.values(InteractionTabs);

export const InteractionTypeSwitch = ({
  counts,
  currentTab,
  disabled = false,
  onTabChange,
  ...flexProps
}: InteractionTypeSwitchProps) => {
  const activeIndex = currentTab ? tabs.indexOf(currentTab) : 0;

  return (
    <Flex
      align="center"
      h="32px"
      p={1}
      sx={{ ...(disabled ? { opacity: 0.3, pointerEvents: "none" } : {}) }}
      border="1px solid var(--chakra-colors-gray-700)"
      borderRadius="4px"
      direction="row"
      position="relative"
      {...flexProps}
    >
      {tabs.map((tab, idx) => (
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
          w="full"
          zIndex={1}
          cursor="pointer"
          onClick={() => {
            track(AmpEvent.USE_SUBTAB, { currentTab: tab });
            onTabChange(tab);
          }}
        >
          <Heading as="h6" variant="h6" fontSize="14px">
            {tab} {counts[idx] !== undefined && `(${counts[idx]})`}
          </Heading>
        </MotionBox>
      ))}
      <MotionBox
        animate={{ left: activeIndex === 0 ? "4px" : "50%" }}
        h="calc(100% - 8px)"
        w="calc(50% - 4px)"
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
  );
};
