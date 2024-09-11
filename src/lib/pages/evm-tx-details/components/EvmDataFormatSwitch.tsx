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
        border="1px solid var(--chakra-colors-gray-700)"
        borderRadius="4px"
        p={1}
        direction="row"
        align="center"
        position="relative"
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
          h="calc(100% - 8px)"
          w="calc(33% - 4px)"
          position="absolute"
          borderRadius="2px"
          backgroundColor="primary.dark"
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
    </div>
  );
};
