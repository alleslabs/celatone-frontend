import { Flex } from "@chakra-ui/react";

import { StepperItem } from "./StepperItem";
import type { Mode, Step } from "./types";

interface StepperProps {
  mode: Mode;
  currentStep: Step;
}

export const Stepper = ({ mode, currentStep }: StepperProps) => (
  <Flex width="100%">
    <StepperItem step={1} mode={mode} currentStep={currentStep} />
    <StepperItem step={2} mode={mode} currentStep={currentStep} />
  </Flex>
);
