import { Flex } from "@chakra-ui/react";
import { useCallback } from "react";

import { MotionBox } from "lib/components/MotionBox";

interface TypeSwitchProps<T extends string> {
  tabs: T[];
  currentTab: T;
  disabled?: boolean;
  onTabChange: (newType: T) => void;
}

export const TypeSwitch = <T extends string>({
  tabs,
  currentTab,
  disabled = false,
  onTabChange: onTabChangeProps,
}: TypeSwitchProps<T>) => {
  const activeIndex = currentTab ? tabs.indexOf(currentTab) : 0;

  const onTabChange = useCallback(
    (tab: T) => {
      onTabChangeProps(tab);
      const content = document.getElementById("content");
      if (content) {
        content.scrollTo({ top: 0 });
      }
    },
    [onTabChangeProps]
  );

  return (
    <Flex
      border="1px solid var(--chakra-colors-gray-700)"
      borderRadius="4px"
      p={1}
      direction="row"
      align="center"
      position="relative"
      height="fit-content"
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
              color: "var(--chakra-colors-white)",
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
          left: `${activeIndex * 96 + 4}px`,
        }}
        transition={{
          type: "spring",
          stiffness: "250",
          damping: "30",
        }}
      />
    </Flex>
  );
};
