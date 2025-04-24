import { Flex } from "@chakra-ui/react";

import type { Mode, Step } from "./types";

import { StepperItem } from "./StepperItem";

interface StepperProps {
  currentStep: Step;
  mode: Mode;
}

export const Stepper = ({ currentStep, mode }: StepperProps) => (
  <Flex width="100%">
    <StepperItem currentStep={currentStep} mode={mode} step={1} />
    <StepperItem currentStep={currentStep} mode={mode} step={2} />
  </Flex>
);
