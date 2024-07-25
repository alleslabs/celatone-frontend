import { chakra, Flex, Text } from "@chakra-ui/react";

import { PeriodState } from "../types";
import { CustomIcon } from "lib/components/icon";

import { ActiveDot } from "./ActiveDot";

const StyledCustomIcon = chakra(CustomIcon, {
  baseStyle: {
    boxSize: 3,
    p: 0,
    m: 1,
  },
});

export interface ProgressBadgeProps {
  state: PeriodState;
  text: string;
  bgColor?: string;
}

const BadgeIcon = ({ state }: { state: PeriodState }) => {
  switch (state) {
    case PeriodState.ONGOING:
      return <ActiveDot m={1} />;
    case PeriodState.FAILED:
      return <StyledCustomIcon name="close-circle-solid" color="error.main" />;
    case PeriodState.COMPLETE:
      return (
        <StyledCustomIcon name="check-circle-solid" color="success.main" />
      );
    default:
      return (
        <Flex
          w="14px"
          h="14px"
          minW="14px"
          minH="14px"
          backgroundColor="gray.600"
          borderRadius="100%"
        />
      );
  }
};

export const ProgressBadge = ({
  state,
  text,
  bgColor = "gray.900",
}: ProgressBadgeProps) => (
  <Flex
    p="4px 8px"
    gap={2}
    alignItems="center"
    justifyContent="center"
    bgColor={bgColor}
    borderRadius="8px"
  >
    <BadgeIcon state={state} />
    <Text variant="body3" color="text.main" whiteSpace="nowrap">
      {text}
    </Text>
  </Flex>
);
