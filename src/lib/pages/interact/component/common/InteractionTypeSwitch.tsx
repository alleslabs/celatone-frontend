import type { FlexProps } from "@chakra-ui/react";
import type { Option } from "lib/types";
import type { Dispatch, SetStateAction } from "react";

import { Flex, Heading } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { MotionBox } from "lib/components/MotionBox";

export enum InteractionTabs {
  VIEW_MODULE = "View",
  EXECUTE_MODULE = "Execute",
}

interface InteractionTypeSwitchProps extends FlexProps {
  currentTab: InteractionTabs;
  disabled?: boolean;
  counts: [Option<number>, Option<number>];
  onTabChange: Dispatch<SetStateAction<InteractionTabs>>;
}

const tabs = Object.values(InteractionTabs);

export const InteractionTypeSwitch = ({
  currentTab,
  disabled = false,
  counts,
  onTabChange,
  ...flexProps
}: InteractionTypeSwitchProps) => {
  const activeIndex = currentTab ? tabs.indexOf(currentTab) : 0;

  return (
    <Flex
      align="center"
      border="1px solid var(--chakra-colors-gray-700)"
      borderRadius="4px"
      direction="row"
      h="32px"
      p={1}
      position="relative"
      sx={{ ...(disabled ? { pointerEvents: "none", opacity: 0.3 } : {}) }}
      {...flexProps}
    >
      {tabs.map((tab, idx) => (
        <MotionBox
          key={tab}
          animate={currentTab === tab ? "active" : "inactive"}
          cursor="pointer"
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
          onClick={() => {
            track(AmpEvent.USE_SUBTAB, { currentTab: tab });
            onTabChange(tab);
          }}
        >
          <Heading as="h6" fontSize="14px" variant="h6">
            {tab} {counts[idx] !== undefined && `(${counts[idx]})`}
          </Heading>
        </MotionBox>
      ))}
      <MotionBox
        animate={{ left: activeIndex === 0 ? "4px" : "50%" }}
        backgroundColor="primary.darker"
        borderRadius="2px"
        h="calc(100% - 8px)"
        position="absolute"
        transition={{
          type: "spring",
          stiffness: "250",
          damping: "30",
        }}
        w="calc(50% - 4px)"
      />
    </Flex>
  );
};
