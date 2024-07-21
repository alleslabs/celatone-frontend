import { Flex } from "@chakra-ui/react";
import { useState } from "react";

import GasFeeDetails from "../gas-fee-details";
import NetworkDetails from "../network-details";
import SupportedFeatures from "../supported-features";
import WalletRegistry from "../wallet-registry";
import ActionPageContainer from "lib/components/ActionPageContainer";

import { AddNetworkStepper } from "./AddNetworkStepper";
import { StepNavigationButtons } from "./StepNavigationButtons";

const StepContainer = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    <NetworkDetails key="network-details" />,
    <SupportedFeatures key="supported-features" />,
    <GasFeeDetails key="gas-fee-details" />,
    <WalletRegistry key="wallet-registry" />,
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Flex direction="column" position="relative" w="full">
      <Flex position="sticky" top={0} left={0} w="full" zIndex={2}>
        <AddNetworkStepper currentStep={currentStep} />
      </Flex>
      <ActionPageContainer width={640}>
        {steps[currentStep]}
      </ActionPageContainer>
      <StepNavigationButtons
        currentStep={currentStep}
        totalSteps={steps.length}
        nextStep={nextStep}
        prevStep={prevStep}
      />
    </Flex>
  );
};

export default StepContainer;
