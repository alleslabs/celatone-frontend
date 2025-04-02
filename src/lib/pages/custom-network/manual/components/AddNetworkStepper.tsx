import { Flex, Text } from "@chakra-ui/react";

import { getStepStyles } from "../helpers";

const steps = [
  { label: "Network Details" },
  { label: "Gas & Fee Details" },
  { label: "Wallet Registry" },
];

interface AddNetworkStepperProps {
  currentStepIndex: number;
}

export const AddNetworkStepper = ({
  currentStepIndex,
}: AddNetworkStepperProps) => (
  <Flex justifyContent="space-between" mb={8} w="full">
    {steps.map((step, index) => {
      const { bgColor, textColor, borderColor, content } = getStepStyles(
        index,
        currentStepIndex
      );

      return (
        <Flex
          key={step.label}
          alignItems="center"
          bg={bgColor}
          borderBottomWidth="4px"
          borderColor={borderColor}
          borderStyle="solid"
          gap={2}
          px={4}
          py={3}
          w="full"
        >
          {content}
          <Text color={textColor}>{step.label}</Text>
        </Flex>
      );
    })}
  </Flex>
);
