import type { FlexProps } from "@chakra-ui/react";
import type { Option } from "lib/types";

import { Flex, Heading } from "@chakra-ui/react";
import { MotionBox } from "lib/components/MotionBox";

import { FunctionTypeTabIndex } from "../../types";

interface FunctionTypeSwitchProps extends FlexProps {
  currentTab: FunctionTypeTabIndex;
  disabled?: boolean;
  counts: [Option<number>, Option<number>, Option<number>];
  onTabChange: (newTab: FunctionTypeTabIndex) => void;
}

const tabs = Object.values(FunctionTypeTabIndex);

export const FunctionTypeSwitch = ({
  currentTab,
  disabled = false,
  counts,
  onTabChange,
  ...flexProps
}: FunctionTypeSwitchProps) => {
  const activeIndex = tabs.indexOf(currentTab);
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
      w={{ base: "full", md: "auto" }}
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
                opacity: 0.3,
                cursor: "not-allowed",
                onClick: undefined,
              }
            : {
                onClick: () => onTabChange(tab),
                cursor: "pointer",
              })}
        >
          <Heading as="h6" fontSize={{ base: "12px", md: "14px" }} variant="h6">
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
        backgroundColor={
          counts[activeIndex] === 0 ? "primary.darker" : "primary.dark"
        }
        borderRadius="2px"
        h="calc(100% - 8px)"
        position="absolute"
        transition={{
          type: "spring",
          stiffness: "250",
          damping: "30",
        }}
        w={{ base: "33%", md: "128px" }}
      />
    </Flex>
  );
};
