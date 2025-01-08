import { Flex } from "@chakra-ui/react";

import { StepperItem } from "./StepperItem";
import type { Mode, Step } from "./types";

interface StepperProps {
  currentStep: Step;
  mode: Mode;
}

export const Stepper = ({ currentStep, mode }: StepperProps) => (
  <Flex width="100%">
    <StepperItem currentStep={currentStep} step={1} mode={mode} />
    <StepperItem currentStep={currentStep} step={2} mode={mode} />
  </Flex>
);
