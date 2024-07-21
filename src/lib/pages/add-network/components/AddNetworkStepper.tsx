import { Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

const steps = [
  { label: "Network Details" },
  { label: "Supported Features" },
  { label: "Gas & Fee Details" },
  { label: "Wallet Registry" },
];

interface AddNetworkStepperProps {
  currentStep: number;
}

const getStepStyles = (index: number, currentStep: number) => {
  const baseStyles = {
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    alignItems: "center",
    justifyContent: "center",
  };

  switch (true) {
    case index < currentStep:
      return {
        bgColor: "gray.900",
        borderColor: "text.main",
        textColor: "text.main",
        content: (
          <Flex {...baseStyles} bg="text.main">
            <CustomIcon name="check" color="gray.900" boxSize="12px" />
          </Flex>
        ),
      };
    case index === currentStep:
      return {
        bgColor: "gray.800",
        borderColor: "text.main",
        textColor: "text.main",
        content: (
          <Flex {...baseStyles} bg="text.main">
            <Text variant="body3" color="gray.900">
              {index + 1}
            </Text>
          </Flex>
        ),
      };
    default:
      return {
        bgColor: "gray.900",
        borderColor: "gray.800",
        textColor: "text.dark",
        content: (
          <Flex {...baseStyles} border="1px solid" borderColor="gray.500">
            <Text variant="body3" color="gray.500">
              {index + 1}
            </Text>
          </Flex>
        ),
      };
  }
};

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
