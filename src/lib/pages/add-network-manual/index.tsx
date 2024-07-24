import { Flex } from "@chakra-ui/react";
import { useState } from "react";

import ActionPageContainer from "lib/components/ActionPageContainer";
import { CustomNetworkFooterCta } from "lib/components/custom-network";
import { CelatoneSeo } from "lib/components/Seo";

import { AddNetworkStepper } from "./components/AddNetworkStepper";
import GasFeeDetails from "./components/GasFeeDetails";
import NetworkDetails from "./components/NetworkDetails";
import SupportedFeatures from "./components/SupportedFeatures";
import WalletRegistry from "./components/WalletRegistry";

export const AddNetworkManual = () => {
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
    <>
      <CelatoneSeo pageName="Add Minitias" />
      <Flex direction="column" position="relative" w="full">
        <Flex position="sticky" top={0} left={0} w="full" zIndex={2}>
          <AddNetworkStepper currentStep={currentStep} />
        </Flex>
        <ActionPageContainer width={640}>
          {steps[currentStep]}
        </ActionPageContainer>
        <CustomNetworkFooterCta
          currentStep={currentStep}
          totalSteps={steps.length}
          leftButtonAction={nextStep}
          rightButtonAction={prevStep}
        />
      </Flex>
    </>
  );
};
