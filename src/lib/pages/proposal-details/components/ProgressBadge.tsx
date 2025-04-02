import { chakra, Flex, Text } from "@chakra-ui/react";
import { ActiveDot } from "lib/components/ActiveDot";
import { CustomIcon } from "lib/components/icon";

import { PeriodState } from "../types";

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
      return <StyledCustomIcon color="error.main" name="close-circle-solid" />;
    case PeriodState.COMPLETE:
      return (
        <StyledCustomIcon color="success.main" name="check-circle-solid" />
      );
    default:
      return <CustomIcon color="gray.600" name="circle" />;
  }
};

export const ProgressBadge = ({
  state,
  text,
  bgColor = "gray.900",
}: ProgressBadgeProps) => (
  <Flex
    alignItems="center"
    bgColor={bgColor}
    borderRadius="8px"
    gap={2}
    justifyContent="center"
    p="4px 8px"
  >
    <BadgeIcon state={state} />
    <Text color="text.main" variant="body3" whiteSpace="nowrap">
      {text}
    </Text>
  </Flex>
);
