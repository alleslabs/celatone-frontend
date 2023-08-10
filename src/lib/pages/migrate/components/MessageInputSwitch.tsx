import { Flex } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";
import { useRef } from "react";

import { MotionBox } from "lib/components/MotionBox";

interface MessageInputSwitchProps<T> {
  currentTab: T;
  tabs: T[];
  disabled?: boolean;
  onTabChange: Dispatch<SetStateAction<T>>;
}

export const MessageInputSwitch = <T extends string>({
  currentTab,
  tabs,
  disabled = false,
  onTabChange,
}: MessageInputSwitchProps<T>) => {
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeIndex = tabs.indexOf(currentTab);
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
          ref={(el) => {
            tabRefs.current[idx] = el;
          }}
          cursor="pointer"
          p="2px 10px"
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
          onClick={() => onTabChange(tab)}
          zIndex={1}
          textAlign="center"
        >
          {tab}
        </MotionBox>
      ))}
      <MotionBox
        h={tabRefs.current[activeIndex]?.clientHeight}
        w={tabRefs.current[activeIndex]?.clientWidth}
        position="absolute"
        borderRadius="2px"
        backgroundColor="primary.dark"
        animate={{ left: `${tabRefs.current[activeIndex]?.offsetLeft}px` }}
        transition={{
          type: "spring",
          stiffness: "250",
          damping: "30",
        }}
      />
    </Flex>
  );
};
