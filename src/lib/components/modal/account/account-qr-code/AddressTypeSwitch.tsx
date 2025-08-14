import type { Dispatch, SetStateAction } from "react";

import { Flex, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { MotionBox } from "lib/components/MotionBox";

export enum AddressType {
  init = "init",
  "0x" = "0x",
}

interface AddressTypeSwitchProps {
  currentTab: AddressType;
  onTabChange: Dispatch<SetStateAction<AddressType>>;
}

const tabs = Object.values(AddressType);

export const AddressTypeSwitch = ({
  currentTab,
  onTabChange,
}: AddressTypeSwitchProps) => {
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
      w={100}
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
          <Text variant="body3">{tab}</Text>
        </MotionBox>
      ))}
      <MotionBox
        animate={{ left: activeIndex === 0 ? "4px" : "50%" }}
        backgroundColor="primary.darker"
        borderRadius="2px"
        h="calc(100% - 8px)"
        position="absolute"
        transition={{
          damping: "30",
          stiffness: "250",
          type: "spring",
        }}
        w="calc(50% - 4px)"
      />
    </Flex>
  );
};
