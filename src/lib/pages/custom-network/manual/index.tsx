import { Flex, useDisclosure } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAllowCustomNetworks,
  useChainConfigs,
  useInternalNavigate,
} from "lib/app-provider";
import ActionPageContainer from "lib/components/ActionPageContainer";
import { CustomIcon } from "lib/components/icon";
import { FooterCta } from "lib/components/layouts";
import { CelatoneSeo } from "lib/components/Seo";
import { useStepper } from "lib/hooks";
import { useLocalChainConfigStore } from "lib/providers/store";
import { useForm } from "react-hook-form";

import type { AddNetworkManualForm } from "../types";

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
import { AddNetworkForm, AddNetworkStepper } from "./components";

export const AddNetworkManual = () => {
  useAllowCustomNetworks({ shouldRedirect: true });
  const navigate = useInternalNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { addLocalChainConfig } = useLocalChainConfigStore();
  const { isChainIdExist } = useChainConfigs();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<AddNetworkManualForm>({
    resolver: zodResolver(zAddNetworkManualForm({ isChainIdExist })),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      ...DEFAULT_GAS,
      prettyName: "",
      rest: "",
      rpc: "",
      chainId: "",
      registryChainName: "",
      logoUri: "",
      vm: {
        type: VmType.MOVE,
      },
      denom: DEFAULT_DENOM,
      gasConfig: "standard",
      bech32_prefix: "",
      slip44: DEFAULT_SLIP44,
      assets: [],
    },
  });

  const {
    vm,
    prettyName,
    rest,
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
      }).parse(data)
    );

    onOpen();
  };

  const { currentStepIndex, handleNext, handlePrevious, hasNext, hasPrevious } =
    useStepper(3, handleSubmit(handleSubmitForm), () =>
      navigate({ pathname: "/custom-network/add" })
    );

  const isFormDisabled = () => {
    if (currentStepIndex === 0)
      return !zNetworkDetailsForm({
        isChainIdExist,
      }).safeParse({
        vm,
        prettyName,
        rest,
        rpc,
        chainId,
        registryChainName,
        logoUri,
      }).success;

    if (currentStepIndex === 1)
      return !zGasConfigFeeDetailsForm.safeParse({
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
    if (currentStepIndex === 2) return "Save new rollup";

    return "Next";
  };

  return (
    <>
      <CelatoneSeo pageName="Add rollups" />
      <Flex left={0} position="sticky" top={0} w="full" zIndex={2}>
        <AddNetworkStepper currentStepIndex={currentStepIndex} />
      </Flex>
      <ActionPageContainer width={640}>
        <AddNetworkForm
          control={control}
          currentStepIndex={currentStepIndex}
          errors={errors}
          setValue={setValue}
          trigger={trigger}
        />
      </ActionPageContainer>
      <FooterCta
        actionButton={{
          onClick: handleNext,
          isDisabled: isFormDisabled(),
          rightIcon: hasNext ? (
            <CustomIcon boxSize={4} name="chevron-right" />
          ) : undefined,
        }}
        actionLabel={handleActionLabel()}
        cancelButton={{
          onClick: handlePrevious,
          variant: "outline-primary",
          leftIcon: hasPrevious ? (
            <CustomIcon boxSize={4} name="chevron-left" />
          ) : undefined,
        }}
        cancelLabel={hasPrevious ? "Previous" : "Cancel"}
        helperText="The added custom rollup on Initia Scan will be stored locally on your device."
        sx={{
          backgroundColor: "background.main",
          borderColor: "gray.700",
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
