import type { FlexProps } from "@chakra-ui/react";
import { Flex, Heading } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { MotionBox } from "lib/components/MotionBox";

export enum ModuleFileTabs {
  SOURCE_CODE = "Source Code",
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
      border="1px solid var(--chakra-colors-gray-700)"
      borderRadius="4px"
      p={1}
      h="32px"
      direction="row"
      align="center"
      position="relative"
      {...flexProps}
      w="300px"
    >
      {tabs.map((tab) => (
        <MotionBox
          key={tab}
          w="full"
          cursor="pointer"
          p="2px 10px"
          variants={{
            active: { color: "var(--chakra-colors-text-main)" },
            inactive: {
              color: "var(--chakra-colors-primary-light)",
            },
          }}
          initial="inactive"
          animate={currentTab === tab ? "active" : "inactive"}
          onClick={() => {
            track(AmpEvent.USE_SUBTAB, { currentTab: tab });
            onTabChange(tab);
          }}
          zIndex={1}
          textAlign="center"
        >
          <Heading as="h6" variant="h6" fontSize="14px">
            {tab}
          </Heading>
        </MotionBox>
      ))}
      <MotionBox
        h="calc(100% - 8px)"
        w="calc(50% - 4px)"
        position="absolute"
        borderRadius="2px"
        backgroundColor="primary.darker"
        animate={{ left: activeIndex === 0 ? "4px" : "50%" }}
        transition={{
          type: "spring",
          stiffness: "250",
          damping: "30",
        }}
      />
    </Flex>
  );
};
