import { Flex } from "@chakra-ui/react";
import { MotionBox } from "lib/components/MotionBox";
import { useCallback } from "react";

interface TypeSwitchProps<T extends string> {
  tabs: T[];
  currentTab: T;
  disabled?: boolean;
  onTabChange: (newType: T) => void;
  disabledScrollToTop?: boolean;
}

export const TypeSwitch = <T extends string>({
  currentTab,
  disabled = false,
  disabledScrollToTop = false,
  onTabChange: onTabChangeProps,
  tabs,
}: TypeSwitchProps<T>) => {
  const activeIndex = currentTab ? tabs.indexOf(currentTab) : 0;

  const onTabChange = useCallback(
    (tab: T) => {
      onTabChangeProps(tab);
      const content = document.getElementById("content");
      if (content && !disabledScrollToTop) {
        content.scrollTo({ top: 0 });
      }
    },
    [onTabChangeProps, disabledScrollToTop]
  );

  return (
    <Flex
      align="center"
      border="1px solid var(--chakra-colors-gray-700)"
      borderRadius="4px"
      direction="row"
      height="fit-content"
      p={1}
      position="relative"
      sx={{ ...(disabled ? { opacity: 0.3, pointerEvents: "none" } : {}) }}
    >
      {tabs.map((tab) => (
        <MotionBox
          key={tab}
          animate={currentTab === tab ? "active" : "inactive"}
          cursor="pointer"
          fontSize="12px"
          fontWeight={700}
          initial="inactive"
          p="2px 10px"
          textAlign="center"
          textTransform="capitalize"
          variants={{
            active: { color: "var(--chakra-colors-text-main)" },
            inactive: {
              color: "var(--chakra-colors-white)",
            },
          }}
          w="96px"
          zIndex={1}
          onClick={() => onTabChange(tab as T)}
        >
          {tab}
        </MotionBox>
      ))}
      <MotionBox
        animate={{
          left: `${activeIndex * 96 + 4}px`,
        }}
        backgroundColor="primary.darker"
        borderRadius="2px"
        h="22px"
        position="absolute"
        transition={{
          damping: "30",
          stiffness: "250",
          type: "spring",
        }}
        w="96px"
      />
    </Flex>
  );
};
