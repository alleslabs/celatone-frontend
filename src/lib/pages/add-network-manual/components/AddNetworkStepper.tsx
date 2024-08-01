import { Flex, Text } from "@chakra-ui/react";

import { getStepStyles } from "../hooks/utils";

const steps = [
  { label: "Network Details" },
  { label: "Supported Features" },
  { label: "Gas & Fee Details" },
  { label: "Wallet Registry" },
];

interface AddNetworkStepperProps {
  currentStep: number;
}

export const AddNetworkStepper = ({ currentStep }: AddNetworkStepperProps) => (
  <Flex justifyContent="space-between" mb={8} w="full">
    {steps.map((step, index) => {
      const { bgColor, textColor, borderColor, content } = getStepStyles(
        index,
        currentStep
      );

      return (
        <Flex
          key={step.label}
          alignItems="center"
          w="full"
          px={4}
          py={3}
          gap={2}
          bg={bgColor}
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
