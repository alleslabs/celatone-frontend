import { Flex } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import ActionPageContainer from "lib/components/ActionPageContainer";
import { FooterCta } from "lib/components/layouts";
import { CelatoneSeo } from "lib/components/Seo";

import {
  AddNetworkStepper,
  NetworkDetails,
  SupportedFeatures,
  WalletRegistry,
} from "./components";
import GasFeeDetails from "./components/GasFeeDetails";
import { useNetworkStepper } from "./hooks/useNetworkStepper";
import { zAddNetworkManualForm, zNetworkDetailsForm } from "./types";

export const AddNetworkManual = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(zAddNetworkManualForm),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      networkName: "Jennie",
      lcdUrl: "https://celat.one",
      rpcUrl: "https://celat.one",
      chainId: "jennie-init",
      registryChainName: "jennitinit",
      logoUri: "",
      isWasm: false,
      isMove: false,
      isNfts: false,
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

  const {
    networkName,
    lcdUrl,
    rpcUrl,
    chainId,
    registryChainName,
    logoUri,
    isWasm,
    isMove,
    isNfts,
  } = watch();

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

    if (currentStep === 1) return <SupportedFeatures control={control} />;

    if (currentStep === 2) return <GasFeeDetails />;

    return <WalletRegistry />;
  };

  const isFormDisabled = () => {
    if (currentStep === 0)
      return !zNetworkDetailsForm.safeParse({
        networkName,
        lcdUrl,
        rpcUrl,
        chainId,
        registryChainName,
        logoUri,
      }).success;

    return false;
  };

  const handleActionLabel = () => {
    if (currentStep === 1 && !isWasm && !isMove && !isNfts) return "Skip";

    return "Next";
  };

  return (
    <>
      <CelatoneSeo pageName="Add Minitias" />
      <Flex position="sticky" top={0} left={0} w="full" zIndex={2}>
        <AddNetworkStepper currentStep={currentStep} />
      </Flex>
      <ActionPageContainer width={640}>{renderFormUI()}</ActionPageContainer>
      <FooterCta
        cancelButton={{
          onClick: handlePrevious,
          variant: "outline-secondary",
          isDisabled: currentStep === 0,
        }}
        actionButton={{
          onClick: handleNext,
          isDisabled: isFormDisabled(),
        }}
        actionLabel={handleActionLabel()}
        helperText="The added custom Minitia on Initiascan will be stored locally on your device."
        sx={{
          backgroundColor: "background.main",
          borderColor: "gray.700",
        }}
      />
    </>
  );
};
