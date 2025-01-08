import { Flex } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

import { MotionBox } from "lib/components/MotionBox";

export enum EvmDataFormatTabs {
  Formatted = "Formatted",
  Raw = "Raw",
  UTF8 = "UTF-8",
}

interface EvmDataFormatSwitchProps {
  currentTab: EvmDataFormatTabs;
  disabled?: boolean;
  onTabChange: Dispatch<SetStateAction<EvmDataFormatTabs>>;
}

const tabs = Object.values(EvmDataFormatTabs);

export const EvmDataFormatSwitch = ({
  currentTab,
  disabled = false,
  onTabChange,
}: EvmDataFormatSwitchProps) => {
  const activeIndex = currentTab ? tabs.indexOf(currentTab) : 0;

  // TODO: current implementation of sliding box dimensions and position is hardcoded due to issues with ref, improve this later
  return (
    <div>
      <Flex
        align="center"
        p={1}
        sx={{ ...(disabled ? { opacity: 0.3, pointerEvents: "none" } : {}) }}
        border="1px solid var(--chakra-colors-gray-700)"
        borderRadius="4px"
        direction="row"
        position="relative"
      >
        {tabs.map((tab) => (
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
            w="96px"
            zIndex={1}
            cursor="pointer"
            fontSize="12px"
            fontWeight={700}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </MotionBox>
        ))}
        <MotionBox
          animate={{
            left: `${activeIndex * 96 + 4}px`,
          }}
          h="calc(100% - 8px)"
          w="calc(33% - 4px)"
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
    </div>
  );
};
