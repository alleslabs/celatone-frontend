import { Flex, Heading } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";
import { useRef } from "react";

import { MotionBox } from "lib/components/MotionBox";
import type { Option } from "lib/types";

export enum MessageTabs {
  VIEW_MODULE = "View",
  EXECUTE_MODULE = "Execute",
}

export const viewModuleFormKey = MessageTabs.VIEW_MODULE as "View";
export const executeModuleFormKey = MessageTabs.EXECUTE_MODULE as "Execute";

interface InteractionTypeSwitchProps {
  currentTab: Option<MessageTabs>;
  disabled?: boolean;
  onTabChange: Dispatch<SetStateAction<Option<MessageTabs>>>;
}

const tabs = Object.values(MessageTabs);

export const InteractionTypeSwitch = ({
  currentTab,
  disabled = false,
  onTabChange,
}: InteractionTypeSwitchProps) => {
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeIndex = currentTab ? tabs.indexOf(currentTab) : -1;

  return (
    <Flex
      border="1px solid var(--chakra-colors-gray-700)"
      borderRadius="4px"
      p={1}
      direction="row"
      align="center"
      position="relative"
      sx={{ ...(disabled ? { pointerEvents: "none", opacity: 0.3 } : {}) }}
    >
      {tabs.map((tab, idx) => (
        <MotionBox
          key={tab}
          w="full"
          ref={(el) => {
            tabRefs.current[idx] = el;
          }}
          cursor="pointer"
          p="2px 10px"
          variants={{
            active: { color: "var(--chakra-colors-text-main)" },
            inactive: {
              color: "var(--chakra-colors-primary-light)",
            },
          }}
          initial="inactive"
          animate={currentTab === tab ? "active" : "inactive"}
          onClick={() => onTabChange(tab)}
          zIndex={1}
          textAlign="center"
        >
          <Heading as="h6" variant="h6" fontSize="14px">
            {tab}
          </Heading>
        </MotionBox>
      ))}
      <MotionBox
        h={tabRefs.current[activeIndex]?.clientHeight}
        w={tabRefs.current[activeIndex]?.clientWidth}
        position="absolute"
        borderRadius="2px"
        backgroundColor="primary.dark"
        animate={{ left: `${tabRefs.current[activeIndex]?.offsetLeft ?? 0}px` }}
        transition={{
          type: "spring",
          stiffness: "250",
          damping: "30",
        }}
      />
    </Flex>
  );
};
