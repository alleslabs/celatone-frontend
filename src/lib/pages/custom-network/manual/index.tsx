import { Flex, useDisclosure } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useAllowCustomNetworks } from "lib/app-provider";
import ActionPageContainer from "lib/components/ActionPageContainer";
import { CustomIcon } from "lib/components/icon";
import { FooterCta } from "lib/components/layouts";
import { CelatoneSeo } from "lib/components/Seo";
import { useChainConfigStore } from "lib/providers/store";

import {
  AddNetworkForm,
  AddNetworkStepper,
  SuccessAddCustomMinitiaModal,
} from "./components";
import { useNetworkStepper } from "./hooks/useNetworkStepper";
import {
  zAddNetworkManualChainConfigJson,
  zAddNetworkManualForm,
  zGasFeeDetailsForm,
  zNetworkDetailsForm,
  zWalletRegistryForm,
} from "./types";
import type { AddNetworkManualForm } from "./types";

export const AddNetworkManual = () => {
  useAllowCustomNetworks({ shouldRedirect: true });
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { addChainConfig, isChainIdExist, isPrettyNameExist } =
    useChainConfigStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<AddNetworkManualForm>({
    resolver: zodResolver(
      zAddNetworkManualForm({ isChainIdExist, isPrettyNameExist })
    ),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      networkName: "",
      lcdUrl: "",
      rpcUrl: "",
      chainId: "",
      registryChainName: "",
      logoUri: "",
      isWasm: false,
      isMove: false,
      isNfts: false,
      gasAdjustment: "",
      maxGasLimit: "",
      feeTokenDenom: "",
      gasConfig: "standard",
      gasPrice: "",
      fixedMinimumGasPrice: "",
      lowGasPrice: "",
      averageGasPrice: "",
      highGasPrice: "",
      gasForCosmosSend: "",
      gasForIbc: "",
      bech32Prefix: "init",
      slip44: 118,
      assets: [],
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
    gasAdjustment,
    maxGasLimit,
    feeTokenDenom,
    gasConfig,
    gasPrice,
    fixedMinimumGasPrice,
    lowGasPrice,
    averageGasPrice,
    highGasPrice,
    gasForCosmosSend,
    gasForIbc,
    bech32Prefix,
    slip44,
    assets,
  } = watch();

  const handleSubmitForm = (data: AddNetworkManualForm) => {
    addChainConfig(
      data.chainId,
      zAddNetworkManualChainConfigJson({
        isChainIdExist,
        isPrettyNameExist,
      }).parse(data)
    );

    onOpen();
  };

  const { currentStep, handleNext, handlePrevious, hasNext, hasPrevious } =
    useNetworkStepper(4, handleSubmit(handleSubmitForm));

  const isFormDisabled = () => {
    if (currentStep === 0)
      return !zNetworkDetailsForm({
        isChainIdExist,
        isPrettyNameExist,
      }).safeParse({
        networkName,
        lcdUrl,
        rpcUrl,
        chainId,
        registryChainName,
        logoUri,
      }).success;

    if (currentStep === 2)
      return !zGasFeeDetailsForm.safeParse({
        gasAdjustment,
        maxGasLimit,
        feeTokenDenom,
        gasConfig,
        gasPrice,
        fixedMinimumGasPrice,
        lowGasPrice,
        averageGasPrice,
        highGasPrice,
        gasForCosmosSend,
        gasForIbc,
      }).success;

    if (currentStep === 3)
      return !zWalletRegistryForm.safeParse({
        bech32Prefix,
        slip44,
        assets,
      }).success;

    return false;
  };

  const showSkipButton = currentStep === 1 && !isWasm && !isMove && !isNfts;

  const handleActionLabel = () => {
    if (showSkipButton) return "Skip";

    if (currentStep === 3) return "Save new Minitia";

    return "Next";
  };

  return (
    <>
      <CelatoneSeo pageName="Add Minitias" />
      <Flex position="sticky" top={0} left={0} w="full" zIndex={2}>
        <AddNetworkStepper currentStep={currentStep} />
      </Flex>
      <ActionPageContainer width={640}>
        <AddNetworkForm
          currentStep={currentStep}
          control={control}
          errors={errors}
          setValue={setValue}
          trigger={trigger}
        />
      </ActionPageContainer>
      <FooterCta
        cancelButton={{
          onClick: handlePrevious,
          variant: "outline-secondary",
          leftIcon: hasPrevious ? (
            <CustomIcon name="chevron-left" boxSize={4} />
          ) : undefined,
        }}
        cancelLabel={hasPrevious ? "Previous" : "Cancel"}
        actionButton={{
          onClick: handleNext,
          isDisabled: isFormDisabled(),
          variant: !showSkipButton ? "primary" : "outline-white",
          rightIcon: hasNext ? (
            <CustomIcon name="chevron-right" boxSize={4} />
          ) : undefined,
        }}
        actionLabel={handleActionLabel()}
        helperText="The added custom Minitia on Initiascan will be stored locally on your device."
        sx={{
          backgroundColor: "background.main",
          borderColor: "gray.700",
        }}
      />
      <SuccessAddCustomMinitiaModal
        isOpen={isOpen}
        onClose={onClose}
        prettyName={networkName}
        chainId={chainId}
      />
    </>
  );
};
