import { Flex, Text } from "@chakra-ui/react";

import { getStepStyles } from "../helpers";

const steps = [
  { label: "Network details" },
  { label: "Gas & Fee details" },
  { label: "Wallet registry" },
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
