import { Flex, useDisclosure } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { SuccessAddCustomMinitiaModal } from "../components";
import {
  VmType,
  zAddNetworkManualChainConfigJson,
  zAddNetworkManualForm,
  zGasFeeDetailsForm,
  zNetworkDetailsForm,
  zWalletRegistryForm,
} from "../types";
import type { AddNetworkManualForm } from "../types";
import { useAllowCustomNetworks, useChainConfigs } from "lib/app-provider";
import ActionPageContainer from "lib/components/ActionPageContainer";
import { CustomIcon } from "lib/components/icon";
import { FooterCta } from "lib/components/layouts";
import { CelatoneSeo } from "lib/components/Seo";
import { useLocalChainConfigStore } from "lib/providers/store";

import { AddNetworkForm, AddNetworkStepper } from "./components";
import { useNetworkStepper } from "./hooks/useNetworkStepper";

export const AddNetworkManual = () => {
  useAllowCustomNetworks({ shouldRedirect: true });
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { addLocalChainConfig } = useLocalChainConfigStore();
  const { isChainIdExist, isPrettyNameExist } = useChainConfigs();

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
      prettyName: "",
      lcd: "",
      rpc: "",
      chainId: "",
      registryChainName: "",
      logoUri: "",
      vm: {
        type: VmType.MOVE,
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25000000,
      denom: "umin",
      gasConfig: "standard",
      gasPrice: 0.15,
      fixed_min_gas_price: 0.15,
      low_gas_price: 0.15,
      average_gas_price: 0.15,
      high_gas_price: 0.15,
      bech32_prefix: "",
      slip44: 118,
      assets: [],
    },
  });

  const {
    vm,
    prettyName,
    lcd,
    rpc,
    chainId,
    registryChainName,
    logoUri,
    gasAdjustment,
    maxGasLimit,
    denom,
    gasConfig,
    gasPrice,
    fixed_min_gas_price: fixedMinGasPrice,
    low_gas_price: lowGasPrice,
    average_gas_price: averageGasPrice,
    high_gas_price: highGasPrice,
    cosmos_send: cosmosSend,
    ibc_transfer: ibcTransfer,
    bech32_prefix: bech32Prefix,
    slip44,
    assets,
  } = watch();

  const handleSubmitForm = (data: AddNetworkManualForm) => {
    addLocalChainConfig(
      data.chainId,
      zAddNetworkManualChainConfigJson({
        isChainIdExist,
        isPrettyNameExist,
      }).parse(data)
    );

    onOpen();
  };

  const { currentStepIndex, handleNext, handlePrevious, hasNext, hasPrevious } =
    useNetworkStepper(3, handleSubmit(handleSubmitForm));

  const isFormDisabled = () => {
    if (currentStepIndex === 0)
      return !zNetworkDetailsForm({
        isChainIdExist,
        isPrettyNameExist,
      }).safeParse({
        vm,
        prettyName,
        lcd,
        rpc,
        chainId,
        registryChainName,
        logoUri,
      }).success;

    if (currentStepIndex === 1)
      return !zGasFeeDetailsForm.safeParse({
        gasAdjustment,
        maxGasLimit,
        denom,
        gasConfig,
        gasPrice,
        fixed_min_gas_price: fixedMinGasPrice,
        low_gas_price: lowGasPrice,
        average_gas_price: averageGasPrice,
        high_gas_price: highGasPrice,
        cosmos_send: cosmosSend,
        ibc_transfer: ibcTransfer,
      }).success;

    if (currentStepIndex === 2)
      return !zWalletRegistryForm.safeParse({
        bech32_prefix: bech32Prefix,
        slip44,
        assets,
      }).success;

    return false;
  };

  const handleActionLabel = () => {
    if (currentStepIndex === 2) return "Save new Minitia";

    return "Next";
  };

  return (
    <>
      <CelatoneSeo pageName="Add Minitias" />
      <Flex position="sticky" top={0} left={0} w="full" zIndex={2}>
        <AddNetworkStepper currentStepIndex={currentStepIndex} />
      </Flex>
      <ActionPageContainer width={640}>
        <AddNetworkForm
          currentStepIndex={currentStepIndex}
          control={control}
          errors={errors}
          setValue={setValue}
          trigger={trigger}
        />
      </ActionPageContainer>
      <FooterCta
        cancelButton={{
          onClick: handlePrevious,
          variant: "outline-primary",
          leftIcon: hasPrevious ? (
            <CustomIcon name="chevron-left" boxSize={4} />
          ) : undefined,
        }}
        cancelLabel={hasPrevious ? "Previous" : "Cancel"}
        actionButton={{
          onClick: handleNext,
          isDisabled: isFormDisabled(),
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
        prettyName={prettyName}
        chainId={chainId}
      />
    </>
  );
};
