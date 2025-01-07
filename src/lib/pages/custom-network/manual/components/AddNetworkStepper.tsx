import { Flex, Text } from "@chakra-ui/react";

import { getStepStyles } from "../hooks/utils";

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
  <Flex mb={8} w="full" justifyContent="space-between">
    {steps.map((step, index) => {
      const { bgColor, borderColor, content, textColor } = getStepStyles(
        index,
        currentStepIndex
      );

      return (
        <Flex
          key={step.label}
          alignItems="center"
          bg={bgColor}
          gap={2}
          px={4}
          py={3}
          w="full"
          borderBottom="4px solid"
          borderColor={borderColor}
        >
          {content}
          <Text color={textColor}>{step.label}</Text>
        </Flex>
      );
    })}
  </Flex>
);
