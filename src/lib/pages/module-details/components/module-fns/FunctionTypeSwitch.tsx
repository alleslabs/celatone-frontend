import type { FlexProps } from "@chakra-ui/react";
import { Flex, Heading } from "@chakra-ui/react";

import { MotionBox } from "lib/components/MotionBox";
import type { Option } from "lib/types";

export enum FunctionTypeTabs {
  ALL = "All",
  VIEW = "View",
  EXECUTE = "Execute",
}

interface FunctionTypeSwitchProps extends FlexProps {
  currentTab: FunctionTypeTabs;
  disabled?: boolean;
  counts: [Option<number>, Option<number>, Option<number>];
  onTabChange: (newTab: FunctionTypeTabs) => void;
}

const tabs = Object.values(FunctionTypeTabs);

export const FunctionTypeSwitch = ({
  currentTab,
  disabled = false,
  counts,
  onTabChange,
  ...flexProps
}: FunctionTypeSwitchProps) => {
  const activeIndex = currentTab ? tabs.indexOf(currentTab) : 0;
  return (
    <Flex
      border="1px solid var(--chakra-colors-gray-700)"
      borderRadius="4px"
      p={1}
      h="32px"
      direction="row"
      align="center"
      position="relative"
      w={{ base: "full", md: "auto" }}
      sx={{ ...(disabled ? { pointerEvents: "none", opacity: 0.3 } : {}) }}
      {...flexProps}
    >
      {tabs.map((tab, idx) => (
        <MotionBox
          key={tab}
          w="full"
          minW={{ base: "33%", md: "128px" }}
          p="2px 10px"
          variants={{
            active: { color: "var(--chakra-colors-text-main)" },
            inactive: {
              color: "var(--chakra-colors-primary-light)",
            },
          }}
          initial="inactive"
          animate={currentTab === tab ? "active" : "inactive"}
          zIndex={1}
          textAlign="center"
          {...(counts[idx] === 0
            ? {
                opacity: 0.3,
                cursor: "not-allowed",
                onClick: undefined,
              }
            : {
                onClick: () => onTabChange(tab),
                cursor: "pointer",
              })}
        >
          <Heading as="h6" variant="h6" fontSize={{ base: "12px", md: "14px" }}>
            {tab} {`(${counts[idx]})`}
          </Heading>
        </MotionBox>
      ))}

      <MotionBox
        h="calc(100% - 8px)"
        w={{ base: "33%", md: "128px" }}
        position="absolute"
        borderRadius="2px"
        backgroundColor={
          counts[activeIndex] === 0 ? "primary.darker" : "primary.dark"
        }
        animate={{
          left:
            activeIndex === 0
              ? "4px"
              : `calc(${(100 / 3) * activeIndex}% - 1px)`,
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
