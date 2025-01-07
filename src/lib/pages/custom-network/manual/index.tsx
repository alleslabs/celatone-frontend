import { Flex, useDisclosure } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { SuccessAddCustomMinitiaModal } from "../components";
import { DEFAULT_DENOM, DEFAULT_GAS, DEFAULT_SLIP44 } from "../constant";
import {
  VmType,
  zAddNetworkManualChainConfigJson,
  zAddNetworkManualForm,
  zGasConfigFeeDetailsForm,
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
  const { isChainIdExist } = useChainConfigs();

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    trigger,
    watch,
  } = useForm<AddNetworkManualForm>({
    defaultValues: {
      ...DEFAULT_GAS,
      assets: [],
      bech32_prefix: "",
      chainId: "",
      denom: DEFAULT_DENOM,
      gasConfig: "standard",
      lcd: "",
      logoUri: "",
      prettyName: "",
      registryChainName: "",
      rpc: "",
      slip44: DEFAULT_SLIP44,
      vm: {
        type: VmType.MOVE,
      },
    },
    mode: "all",
    resolver: zodResolver(zAddNetworkManualForm({ isChainIdExist })),
    reValidateMode: "onChange",
  });

  const {
    assets,
    average_gas_price: averageGasPrice,
    bech32_prefix: bech32Prefix,
    chainId,
    cosmos_send: cosmosSend,
    denom,
    fixed_min_gas_price: fixedMinGasPrice,
    gasAdjustment,
    gasConfig,
    gasPrice,
    high_gas_price: highGasPrice,
    ibc_transfer: ibcTransfer,
    lcd,
    logoUri,
    low_gas_price: lowGasPrice,
    maxGasLimit,
    prettyName,
    registryChainName,
    rpc,
    slip44,
    vm,
  } = watch();

  const handleSubmitForm = (data: AddNetworkManualForm) => {
    addLocalChainConfig(
      data.chainId,
      zAddNetworkManualChainConfigJson({
        isChainIdExist,
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
      }).safeParse({
        chainId,
        lcd,
        logoUri,
        prettyName,
        registryChainName,
        rpc,
        vm,
      }).success;

    if (currentStepIndex === 1)
      return !zGasConfigFeeDetailsForm.safeParse({
        average_gas_price: averageGasPrice,
        cosmos_send: cosmosSend,
        denom,
        fixed_min_gas_price: fixedMinGasPrice,
        gasAdjustment,
        gasConfig,
        gasPrice,
        high_gas_price: highGasPrice,
        ibc_transfer: ibcTransfer,
        low_gas_price: lowGasPrice,
        maxGasLimit,
      }).success;

    if (currentStepIndex === 2)
      return !zWalletRegistryForm.safeParse({
        assets,
        bech32_prefix: bech32Prefix,
        slip44,
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
      <Flex left={0} w="full" zIndex={2} position="sticky" top={0}>
        <AddNetworkStepper currentStepIndex={currentStepIndex} />
      </Flex>
      <ActionPageContainer width={640}>
        <AddNetworkForm
          currentStepIndex={currentStepIndex}
          setValue={setValue}
          trigger={trigger}
          control={control}
          errors={errors}
        />
      </ActionPageContainer>
      <FooterCta
        cancelLabel={hasPrevious ? "Previous" : "Cancel"}
        helperText="The added custom Minitia on Initiascan will be stored locally on your device."
        sx={{
          backgroundColor: "background.main",
          borderColor: "gray.700",
        }}
        actionButton={{
          isDisabled: isFormDisabled(),
          onClick: handleNext,
          rightIcon: hasNext ? (
            <CustomIcon name="chevron-right" boxSize={4} />
          ) : undefined,
        }}
        actionLabel={handleActionLabel()}
        cancelButton={{
          leftIcon: hasPrevious ? (
            <CustomIcon name="chevron-left" boxSize={4} />
          ) : undefined,
          onClick: handlePrevious,
          variant: "outline-primary",
        }}
      />
      <SuccessAddCustomMinitiaModal
        chainId={chainId}
        isOpen={isOpen}
        prettyName={prettyName}
        onClose={onClose}
      />
    </>
  );
};
