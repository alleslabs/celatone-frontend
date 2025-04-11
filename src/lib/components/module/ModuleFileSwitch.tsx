import type { FlexProps } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

import { Flex, Heading } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { MotionBox } from "lib/components/MotionBox";

export enum ModuleFileTabs {
  SOURCE_CODE = "Source code",
  TOML = "Move.toml",
}

interface ModuleFileSwitchProps extends FlexProps {
  currentTab: ModuleFileTabs;
  onTabChange: Dispatch<SetStateAction<ModuleFileTabs>>;
}

const tabs = Object.values(ModuleFileTabs);

export const ModuleFileSwitch = ({
  currentTab,
  onTabChange,
  ...flexProps
}: ModuleFileSwitchProps) => {
  const activeIndex = currentTab ? tabs.indexOf(currentTab) : 0;

  return (
    <Flex
      align="center"
      border="1px solid var(--chakra-colors-gray-700)"
      borderRadius="4px"
      direction="row"
      h="32px"
      p={1}
      position="relative"
      {...flexProps}
      w="300px"
    >
      {tabs.map((tab) => (
        <MotionBox
          key={tab}
          animate={currentTab === tab ? "active" : "inactive"}
          cursor="pointer"
          initial="inactive"
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
          onClick={() => {
            track(AmpEvent.USE_SUBTAB, { currentTab: tab });
            onTabChange(tab);
          }}
        >
          <Heading as="h6" fontSize="14px" variant="h6">
            {tab}
          </Heading>
        </MotionBox>
      ))}
      <MotionBox
        animate={{ left: activeIndex === 0 ? "4px" : "50%" }}
        backgroundColor="primary.darker"
        borderRadius="2px"
        h="calc(100% - 8px)"
        position="absolute"
        transition={{
          type: "spring",
          stiffness: "250",
          damping: "30",
        }}
        w="calc(50% - 4px)"
      />
    </Flex>
  );
};
