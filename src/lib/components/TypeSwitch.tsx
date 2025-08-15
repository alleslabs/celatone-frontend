import { Flex } from "@chakra-ui/react";
import { MotionBox } from "lib/components/MotionBox";
import { useCallback } from "react";

interface TypeSwitchProps<T extends string> {
  currentTab: T;
  disabled?: boolean;
  disabledScrollToTop?: boolean;
  fontSize?: string;
  onTabChange: (newType: T) => void;
  padding?: string;
  tabHeight?: number;
  tabs: T[];
  tabWidth?: number;
}

export const TypeSwitch = <T extends string>({
  currentTab,
  disabled = false,
  disabledScrollToTop = false,
  fontSize = "12px",
  onTabChange: onTabChangeProps,
  padding = "2px 10px",
  tabHeight = 22,
  tabs,
  tabWidth = 96,
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
          fontSize={fontSize}
          fontWeight={700}
          initial="inactive"
          p={padding}
          textAlign="center"
          textTransform="capitalize"
          variants={{
            active: { color: "var(--chakra-colors-text-main)" },
            inactive: {
              color: "var(--chakra-colors-white)",
            },
          }}
          w={`${tabWidth}px`}
          zIndex={1}
          onClick={() => onTabChange(tab as T)}
        >
          {tab}
        </MotionBox>
      ))}
      <MotionBox
        animate={{
          left: `${activeIndex * tabWidth + 4}px`,
        }}
        backgroundColor="primary.darker"
        borderRadius="2px"
        h={`${tabHeight}px`}
        position="absolute"
        transition={{
          damping: "30",
          stiffness: "250",
          type: "spring",
        }}
        w={`${tabWidth}px`}
      />
    </Flex>
  );
};
