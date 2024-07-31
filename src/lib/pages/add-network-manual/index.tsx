import { Flex } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { INITIA_DECODER } from "config/chain/initia";
import ActionPageContainer from "lib/components/ActionPageContainer";
import { CustomIcon } from "lib/components/icon";
import { FooterCta } from "lib/components/layouts";
import { CelatoneSeo } from "lib/components/Seo";
import { useChainConfigStore } from "lib/providers/store";

import {
  AddNetworkStepper,
  NetworkDetails,
  SupportedFeatures,
  WalletRegistry,
} from "./components";
import GasFeeDetails from "./components/GasFeeDetails";
import { useNetworkStepper } from "./hooks/useNetworkStepper";
import {
  zAddNetworkManualForm,
  zGasFeeDetailsForm,
  zNetworkDetailsForm,
  zWalletRegistryForm,
} from "./types";
import type { AddNetworkManualForm } from "./types";

export const AddNetworkManual = () => {
  const { addChainConfig } = useChainConfigStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<AddNetworkManualForm>({
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
      bech32Prefix: "",
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
    addChainConfig(data.chainId, {
      tier: "sequencer",
      chainId: data.chainId,
      chain: "initia",
      registryChainName: data.registryChainName,
      prettyName: data.networkName,
      logo_URIs: {
        png: data.logoUri,
      },
      lcd: data.lcdUrl,
      rpc: data.rpcUrl,
      graphql: "",
      wallets: ["initia", "keplr"],
      features: {
        faucet: {
          enabled: false,
        },
        wasm: data.isWasm
          ? {
              enabled: true,
              storeCodeMaxFileSize: 1024 * 1024 * 2,
              clearAdminGas: 1000000,
            }
          : { enabled: false },
        move: data.isMove
          ? {
              enabled: true,
              moduleMaxFileSize: 1_048_576,
              decodeApi: INITIA_DECODER,
              verify: "",
            }
          : { enabled: false },
        pool: {
          enabled: false,
        },
        publicProject: {
          enabled: true,
        },
        gov: {
          enabled: false,
        },
        nft: {
          enabled: data.isNfts,
        },
      },
      gas: {
        gasAdjustment: Number(data.gasAdjustment),
        maxGasLimit: Number(data.maxGasLimit),
      },
      extra: {
        isValidatorExternalLink: null,
        layer: "2",
      },
      network_type: "testnet",
      fees: {
        fee_tokens: [
          {
            denom: data.feeTokenDenom,
            fixed_min_gas_price: Number(data.fixedMinimumGasPrice),
            low_gas_price: Number(data.lowGasPrice),
            average_gas_price: Number(data.averageGasPrice),
            gas_costs: {
              cosmos_send: Number(data.gasForCosmosSend),
              ibc_transfer: Number(data.gasForIbc),
            },
          },
        ],
      },
      registry: {
        bech32_prefix: data.bech32Prefix,
        slip44: data.slip44,
        staking: {
          staking_tokens: [],
        },
        assets: data.assets.map((asset) => ({
          name: asset.name,
          base: asset.base,
          symbol: asset.symbol,
          denom_units: asset.denoms.map((denom) => ({
            denom: denom.denom,
            exponent: Number(denom.exponent),
          })),
          display: asset.symbol,
        })),
      },
    });
  };

  const { currentStep, handleNext, handlePrevious, hasNext, hasPrevious } =
    useNetworkStepper(4, handleSubmit(handleSubmitForm));

  const renderFormUI = () => {
    if (currentStep === 0)
      return <NetworkDetails control={control} errors={errors} />;

    if (currentStep === 1) return <SupportedFeatures control={control} />;

    if (currentStep === 2)
      return (
        <GasFeeDetails
          control={control}
          errors={errors}
          setValue={setValue}
          trigger={trigger}
        />
      );

    return <WalletRegistry control={control} errors={errors} />;
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
      <ActionPageContainer width={640}>{renderFormUI()}</ActionPageContainer>
      <FooterCta
        cancelButton={{
          onClick: handlePrevious,
          variant: "outline-secondary",
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
    </>
  );
};
