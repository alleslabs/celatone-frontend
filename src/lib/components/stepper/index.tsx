import { Flex } from "@chakra-ui/react";

import { StepperItem } from "./StepperItem";
import type { Step } from "./types";

interface StepperProps {
  currentStep: Step;
}

export const Stepper = ({ currentStep }: StepperProps) => {
  return (
    <Flex width="100%">
      <StepperItem step={1} currentStep={currentStep} />
      <StepperItem step={2} currentStep={currentStep} />
    </Flex>
  );
};
