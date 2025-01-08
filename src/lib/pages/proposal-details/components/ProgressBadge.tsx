import { chakra, Flex, Text } from "@chakra-ui/react";

import { PeriodState } from "../types";
import { ActiveDot } from "lib/components/ActiveDot";
import { CustomIcon } from "lib/components/icon";

const StyledCustomIcon = chakra(CustomIcon, {
  baseStyle: {
    boxSize: 3,
    m: 1,
    p: 0,
  },
});

export interface ProgressBadgeProps {
  bgColor?: string;
  state: PeriodState;
  text: string;
}

const BadgeIcon = ({ state }: { state: PeriodState }) => {
  switch (state) {
    case PeriodState.COMPLETE:
      return (
        <StyledCustomIcon name="check-circle-solid" color="success.main" />
      );
    case PeriodState.FAILED:
      return <StyledCustomIcon name="close-circle-solid" color="error.main" />;
    case PeriodState.ONGOING:
      return <ActiveDot m={1} />;
    default:
      return <CustomIcon name="circle" color="gray.600" />;
  }
};

export const ProgressBadge = ({
  bgColor = "gray.900",
  state,
  text,
}: ProgressBadgeProps) => (
  <Flex
    alignItems="center"
    gap={2}
    p="4px 8px"
    bgColor={bgColor}
    borderRadius="8px"
    justifyContent="center"
  >
    <BadgeIcon state={state} />
    <Text variant="body3" whiteSpace="nowrap" color="text.main">
      {text}
    </Text>
  </Flex>
);
