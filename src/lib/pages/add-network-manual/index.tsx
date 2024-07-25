import { Flex } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import ActionPageContainer from "lib/components/ActionPageContainer";
import { CustomNetworkFooterCta } from "lib/components/custom-network";
import { CelatoneSeo } from "lib/components/Seo";

import {
  AddNetworkStepper,
  NetworkDetails,
  SupportedFeatures,
  WalletRegistry,
} from "./components";
import GasFeeDetails from "./components/GasFeeDetails";
import { useNetworkStepper } from "./hooks/useNetworkStepper";
import { zAddNetworkManualForm } from "./types";

export const AddNetworkManual = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    // getFieldState,
  } = useForm({
    resolver: zodResolver(zAddNetworkManualForm),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      networkName: "",
      lcdUrl: "",
      rpcUrl: "",
      chainId: "",
      registryChainName: "",
      logoUri: "",
      // Gas fee details
      gasAdjustment: "",
      maxGasLimit: "",
      feeTokenDenom: "",
      gasPrice: "",
      fixedMinimumGasPrice: "",
      lowGasPrice: "",
      averageGasPrice: "",
      highGasPrice: "",
      gasForCosmosSend: "",
      gasForIBC: "",
    },
  });

  const handleSubmitForm = () => {
    //
  };

  const { currentStep, handleNext, handlePrevious } = useNetworkStepper(
    4,
    handleSubmit(handleSubmitForm)
  );

  const renderFormUI = () => {
    if (currentStep === 0)
      return <NetworkDetails control={control} errors={errors} />;

    if (currentStep === 1) return <SupportedFeatures />;

    if (currentStep === 2) return <GasFeeDetails />;

    return <WalletRegistry />;
  };

  // const validateFieldState = useCallback(
  //   (shape: string[]): boolean => {
  //     let isFieldValid = true;

  //     shape.forEach((key) => {
  //       const fieldState = getFieldState(key as keyof AddNetworkManualForm);
  //       const { invalid, isDirty } = fieldState;

  //       if (invalid || !isDirty) isFieldValid = false;
  //     });

  //     return isFieldValid;
  //   },
  //   [getFieldState]
  // );

  // const isFormDisabled = useMemo(() => {
  //   if (currentStep === 0) {
  //     return !validateFieldState(Object.keys(zNetworkDetailsForm.shape));
  //   }

  //   return false;
  // }, [validateFieldState, currentStep]);

  return (
    <>
      <CelatoneSeo pageName="Add Minitias" />
      <Flex position="sticky" top={0} left={0} w="full" zIndex={2}>
        <AddNetworkStepper currentStep={currentStep} />
      </Flex>
      <ActionPageContainer width={640}>{renderFormUI()}</ActionPageContainer>
      <CustomNetworkFooterCta
        leftButtonLabel="Previous"
        leftButtonAction={handlePrevious}
        rightButtonLabel="Next"
        rightButtonAction={handleNext}
      />
    </>
  );
};
