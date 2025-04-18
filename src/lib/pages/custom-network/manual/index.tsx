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
      logoUri: "",
      prettyName: "",
      registryChainName: "",
      rest: "",
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
    logoUri,
    low_gas_price: lowGasPrice,
    maxGasLimit,
    prettyName,
    registryChainName,
    rest,
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
    useStepper(3, handleSubmit(handleSubmitForm), () =>
      navigate({ pathname: "/custom-network/add" })
    );

  const isFormDisabled = () => {
    if (currentStepIndex === 0)
      return !zNetworkDetailsForm({
        isChainIdExist,
      }).safeParse({
        chainId,
        logoUri,
        prettyName,
        registryChainName,
        rest,
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
          isDisabled: isFormDisabled(),
          onClick: handleNext,
          rightIcon: hasNext ? (
            <CustomIcon boxSize={4} name="chevron-right" />
          ) : undefined,
        }}
        actionLabel={handleActionLabel()}
        cancelButton={{
          leftIcon: hasPrevious ? (
            <CustomIcon boxSize={4} name="chevron-left" />
          ) : undefined,
          onClick: handlePrevious,
          variant: "outline-primary",
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
