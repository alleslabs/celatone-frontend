import { Flex, Text, chakra } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

import { ActiveDot } from "./ActiveDot";

const StyledCustomIcon = chakra(CustomIcon, {
  baseStyle: {
    boxSize: 3,
    p: 0,
    m: 1,
  },
});

export enum BadgeState {
  ONGOING,
  FAILED,
  COMPLETE,
  WAITING,
}

export interface ProgressBadgeProps {
  state: BadgeState;
  text: string;
}

const BadgeIcon = ({ state }: { state: BadgeState }) => {
  switch (state) {
    case BadgeState.ONGOING:
      return <ActiveDot m={1} />;
    case BadgeState.FAILED:
      return <StyledCustomIcon name="close-circle-solid" color="error.main" />;
    case BadgeState.COMPLETE:
      return (
        <StyledCustomIcon name="check-circle-solid" color="success.main" />
      );
    default:
      return <StyledCustomIcon name="circle" color="gray.600" />;
  }
};

export const ProgressBadge = ({ state, text }: ProgressBadgeProps) => (
  <Flex
    p="4px 8px"
    gap={2}
    alignItems="center"
    justifyContent="center"
    background="gray.900"
    borderRadius="8px"
  >
    <BadgeIcon state={state} />
    <Text variant="body3" color="text.main">
      {text}
    </Text>
  </Flex>
);
