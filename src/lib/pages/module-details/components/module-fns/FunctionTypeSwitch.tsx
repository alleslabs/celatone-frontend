import type { FlexProps } from "@chakra-ui/react";
import { Flex, Heading } from "@chakra-ui/react";

import { FunctionTypeTabIndex } from "../../types";
import { MotionBox } from "lib/components/MotionBox";
import type { Option } from "lib/types";

interface FunctionTypeSwitchProps extends FlexProps {
  counts: [Option<number>, Option<number>, Option<number>];
  currentTab: FunctionTypeTabIndex;
  disabled?: boolean;
  onTabChange: (newTab: FunctionTypeTabIndex) => void;
}

const tabs = Object.values(FunctionTypeTabIndex);

export const FunctionTypeSwitch = ({
  counts,
  currentTab,
  disabled = false,
  onTabChange,
  ...flexProps
}: FunctionTypeSwitchProps) => {
  const activeIndex = tabs.indexOf(currentTab);
  return (
    <Flex
      align="center"
      h="32px"
      p={1}
      sx={{ ...(disabled ? { opacity: 0.3, pointerEvents: "none" } : {}) }}
      w={{ base: "full", md: "auto" }}
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
          minW={{ base: "33%", md: "128px" }}
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
          {...(counts[idx] === 0
            ? {
                cursor: "not-allowed",
                onClick: undefined,
                opacity: 0.3,
              }
            : {
                cursor: "pointer",
                onClick: () => onTabChange(tab),
              })}
        >
          <Heading as="h6" variant="h6" fontSize={{ base: "12px", md: "14px" }}>
            {tab} {`(${counts[idx]})`}
          </Heading>
        </MotionBox>
      ))}

      <MotionBox
        animate={{
          left:
            activeIndex === 0
              ? "4px"
              : `calc(${(100 / 3) * activeIndex}% - 1px)`,
        }}
        h="calc(100% - 8px)"
        w={{ base: "33%", md: "128px" }}
        backgroundColor={
          counts[activeIndex] === 0 ? "primary.darker" : "primary.dark"
        }
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
