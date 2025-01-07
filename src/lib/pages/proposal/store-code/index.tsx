import {
  Alert,
  AlertDescription,
  Box,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
} from "@chakra-ui/react";
import type { Coin, StdFee } from "@cosmjs/stargate";
import { useRouter } from "next/router";
import { gzip } from "node-gzip";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { AssetBox, Footer } from "../components";
import { InitialDeposit } from "../components/InitialDeposit";
import {
  PROPOSAL_STORE_CODE_TEXT,
  SIDEBAR_STORE_CODE_DETAILS,
} from "../constants";
import { getAlert } from "../utils";
import {
  AmpEvent,
  track,
  trackUseDepositFill,
  trackUseSubmitProposal,
  trackUseUnpin,
} from "lib/amplitude";
import {
  useCelatoneApp,
  useCurrentChain,
  useExampleAddresses,
  useFabricateFee,
  useSubmitStoreCodeProposalTx,
  useValidateAddress,
  useWasmConfig,
} from "lib/app-provider";
import { AddressInput } from "lib/components/AddressInput";
import { AssignMe } from "lib/components/AssignMe";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { DropZone } from "lib/components/dropzone";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { ControllerInput, ControllerTextarea } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
import PageContainer from "lib/components/PageContainer";
import { StickySidebar } from "lib/components/StickySidebar";
import { Tooltip } from "lib/components/Tooltip";
import {
  CodeHashBox,
  InstantiatePermissionRadio,
  SimulateMessageRender,
  UploadCard,
} from "lib/components/upload";
import { useGetMaxLengthError, useTxBroadcast } from "lib/hooks";
import { useGovParamsDeprecated } from "lib/model/proposal";
import { useSimulateFeeForProposalStoreCode } from "lib/services/tx";
import { useUploadAccessParamsLcd } from "lib/services/wasm/code";
import type { BechAddr, SimulateStatus, UploadSectionState } from "lib/types";
import { AccessType } from "lib/types";
import {
  composeStoreCodeProposalMsg,
  getAmountToVote,
  getCodeHash,
} from "lib/utils";

interface StoreCodeProposalState {
  builder: string;
  codeHash: string;
  initialDeposit: Coin;
  proposalDesc: string;
  runAs: BechAddr;
  source: string;
  title: string;
  unpinCode: boolean;
}

const defaultValues: StoreCodeProposalState = {
  builder: "",
  codeHash: "",
  initialDeposit: { amount: "", denom: "" } as Coin,
  proposalDesc: "",
  runAs: "" as BechAddr,
  source: "",
  title: "",
  unpinCode: false,
};

const StoreCodeProposal = () => {
  useWasmConfig({ shouldRedirect: true });
  const {
    chainConfig: { prettyName },
    constants,
  } = useCelatoneApp();
  const { user: exampleUserAddress } = useExampleAddresses();
  const getMaxLengthError = useGetMaxLengthError();
  const { address: walletAddress } = useCurrentChain();
  const fabricateFee = useFabricateFee();
  const { data: govParams } = useGovParamsDeprecated();
  const { data: uploadAccessParams } = useUploadAccessParamsLcd();
  const minDeposit = govParams?.depositParams.minDeposit;

  const { validateContractAddress, validateUserAddress } = useValidateAddress();
  const submitStoreCodeProposalTx = useSubmitStoreCodeProposalTx();
  const { broadcast } = useTxBroadcast();

  // States
  const [estimatedFee, setEstimatedFee] = useState<StdFee>();
  const [processing, setProcessing] = useState(false);
  const [simulateStatus, setSimulateStatus] = useState<SimulateStatus>({
    message: "",
    status: "default",
  });
  const {
    control,
    formState: { errors },
    reset,
    setValue,
    trigger,
    watch,
  } = useForm<StoreCodeProposalState>({
    defaultValues,
    mode: "all",
  });
  const {
    control: uploadSectionControl,
    formState: { errors: uploadSectionErrors },
    setValue: uploadSectionSetValue,
    trigger: uploadSectionTrigger,
    watch: uploadSectionWatch,
  } = useForm<UploadSectionState>({
    defaultValues: {
      addresses: [{ address: "" as BechAddr }],
      codeName: "",
      permission: AccessType.ACCESS_TYPE_EVERYBODY,
      wasmFile: undefined,
    },
    mode: "all",
  });
  const {
    builder,
    codeHash,
    initialDeposit,
    proposalDesc,
    runAs,
    source,
    title,
    unpinCode,
  } = watch();
  const { addresses, permission, wasmFile } = uploadSectionWatch();

  // Amp
  const router = useRouter();
  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_PROPOSAL_TO_STORE_CODE);
  }, [router.isReady]);

  const { description, icon, variant } = getAlert(
    initialDeposit.amount,
    govParams?.depositParams.minInitialDeposit,
    minDeposit?.formattedAmount,
    minDeposit?.formattedDenom
  );

  const formErrorsKey = Object.keys(errors);
  const uploadSectionErrorsKey = Object.keys(uploadSectionErrors);

  // Should not simulate when permission is any of addresses and address input is not filled, invalid, or empty
  const shouldNotSimulateForAnyOfAddr = useMemo(
    () =>
      permission === AccessType.ACCESS_TYPE_ANY_OF_ADDRESSES &&
      (addresses.some((addr) => addr.address.trim().length === 0) ||
        Boolean(uploadSectionErrorsKey.length) ||
        addresses.some((addr) =>
          Boolean(
            validateUserAddress(addr.address) &&
              validateContractAddress(addr.address)
          )
        )),
    [
      addresses,
      permission,
      uploadSectionErrorsKey.length,
      validateContractAddress,
      validateUserAddress,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(addresses),
    ]
  );

  const isAllInputFilled = useMemo(
    () =>
      Boolean(
        title &&
          proposalDesc &&
          runAs &&
          initialDeposit.amount &&
          builder &&
          source
      ),
    [builder, initialDeposit.amount, proposalDesc, runAs, source, title]
  );

  // Check whether all input is filled, condition for anyOfAddr is met, and no error occurs for all inputs
  const enabledTx = useMemo(
    () =>
      Boolean(
        isAllInputFilled &&
          !shouldNotSimulateForAnyOfAddr &&
          !formErrorsKey.length &&
          wasmFile
      ),
    [
      formErrorsKey.length,
      isAllInputFilled,
      shouldNotSimulateForAnyOfAddr,
      wasmFile,
    ]
  );

  // Reset simulation status to default when some of the input is not filled
  useEffect(() => {
    if (!enabledTx) setSimulateStatus({ message: "", status: "default" });
  }, [enabledTx]);

  useEffect(() => {
    if (minDeposit)
      reset({
        ...defaultValues,
        initialDeposit: { amount: "", denom: minDeposit.denom },
      });
  }, [minDeposit, reset]);

  // Generate hash value from wasm file
  const setHashValue = useCallback(async () => {
    setValue("codeHash", await getCodeHash(wasmFile));
  }, [setValue, wasmFile]);

  useEffect(() => {
    setHashValue();
  }, [setHashValue]);

  const { isFetching: isSimulating } = useSimulateFeeForProposalStoreCode({
    addresses: addresses.map((addr) => addr.address),
    builder,
    codeHash,
    description: proposalDesc,
    enabled: Boolean(walletAddress && enabledTx),
    initialDeposit,
    onError: (e) => {
      setSimulateStatus({ message: e.message, status: "failed" });
      setEstimatedFee(undefined);
    },
    onSuccess: (fee) => {
      if (wasmFile && walletAddress && fee) {
        setSimulateStatus({
          message: "Valid Wasm file and submitting proposal conditions",
          status: "succeeded",
        });
        setEstimatedFee(fabricateFee(fee));
      }
    },
    permission,
    precision: minDeposit?.precision,
    runAs,
    source,
    title,
    unpinCode,
    wasmFile,
  });

  const proceed = useCallback(async () => {
    if (!wasmFile) return null;

    trackUseSubmitProposal({
      addressesCount: addresses.length,
      assetDenom: initialDeposit.denom,
      initialDeposit: initialDeposit.amount,
      minDeposit: minDeposit?.formattedAmount,
      permission: AccessType[permission],
    });

    const submitStoreCodeProposalMsg = async () => {
      if (!walletAddress) return [];
      return [
        composeStoreCodeProposalMsg({
          addresses: addresses.map((addr) => addr.address),
          builder,
          codeHash: Uint8Array.from(Buffer.from(codeHash, "hex")),
          description: proposalDesc,
          initialDeposit,
          permission,
          precision: minDeposit?.precision,
          proposer: walletAddress,
          runAs,
          source,
          title,
          unpinCode,
          wasmByteCode: await gzip(
            new Uint8Array(await wasmFile.arrayBuffer())
          ),
        }),
      ];
    };
    const craftMsg = await submitStoreCodeProposalMsg();

    const stream = await submitStoreCodeProposalTx({
      amountToVote: getAmountToVote(initialDeposit, minDeposit),
      estimatedFee,
      messages: craftMsg,
      onTxFailed: () => setProcessing(false),
      onTxSucceed: () => setProcessing(false),
      wasmFileName: wasmFile.name,
    });
    if (stream) {
      setProcessing(true);
      broadcast(stream);
    }
    return null;
  }, [
    addresses,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(addresses),
    broadcast,
    builder,
    codeHash,
    estimatedFee,
    initialDeposit,
    minDeposit,
    permission,
    proposalDesc,
    runAs,
    source,
    submitStoreCodeProposalTx,
    title,
    unpinCode,
    walletAddress,
    wasmFile,
  ]);

  return (
    <>
      <PageContainer>
        <Grid
          templateAreas={`"prespace main sidebar postspace"`}
          templateColumns="1fr 5fr 3fr 1fr"
        >
          <GridItem area="main">
            <Heading as="h5" variant="h5">
              {PROPOSAL_STORE_CODE_TEXT.header}
            </Heading>
            <Text pt={4} color="text.dark">
              {PROPOSAL_STORE_CODE_TEXT.description}
            </Text>
            <ConnectWalletAlert
              mt={12}
              subtitle={PROPOSAL_STORE_CODE_TEXT.connectWallet}
            />
            <form>
              <Flex gap={6} my="48px" direction="column">
                <Heading as="h6" mb={6} variant="h6">
                  {PROPOSAL_STORE_CODE_TEXT.header}
                </Heading>

                {/* Title  */}
                <ControllerInput
                  label={PROPOSAL_STORE_CODE_TEXT.titleLabel}
                  name="title"
                  rules={{
                    maxLength: constants.maxProposalTitleLength,
                    required: PROPOSAL_STORE_CODE_TEXT.titleRequired,
                  }}
                  variant="fixed-floating"
                  control={control}
                  error={
                    title.length > constants.maxProposalTitleLength
                      ? getMaxLengthError(title.length, "proposal_title")
                      : errors.title?.message
                  }
                  labelBgColor="background.main"
                  placeholder={PROPOSAL_STORE_CODE_TEXT.titlePlaceholder}
                />

                {/* Description  */}
                <ControllerTextarea
                  height="160px"
                  label={PROPOSAL_STORE_CODE_TEXT.descriptionLabel}
                  name="proposalDesc"
                  rules={{
                    required: PROPOSAL_STORE_CODE_TEXT.descriptionRequired,
                  }}
                  variant="fixed-floating"
                  control={control}
                  error={errors.proposalDesc?.message}
                  labelBgColor="background.main"
                  placeholder={PROPOSAL_STORE_CODE_TEXT.descriptionPlaceholder}
                />

                {/* Run as  */}
                <AddressInput
                  helperText={PROPOSAL_STORE_CODE_TEXT.runAsHelperText}
                  label={PROPOSAL_STORE_CODE_TEXT.runAsLabel}
                  name="runAs"
                  requiredText={PROPOSAL_STORE_CODE_TEXT.runAsRequired}
                  variant="fixed-floating"
                  control={control}
                  error={errors.runAs?.message}
                  helperAction={
                    <AssignMe
                      isDisable={runAs === walletAddress}
                      onClick={
                        walletAddress
                          ? () => {
                              track(AmpEvent.USE_ASSIGN_ME);
                              setValue("runAs", walletAddress);
                              trigger("runAs");
                            }
                          : undefined
                      }
                    />
                  }
                  labelBgColor="background.main"
                  placeholder={`ex. ${exampleUserAddress}`}
                />

                {/* Upload file  */}
                <Heading as="h6" pb={6} pt={12} variant="h6">
                  {PROPOSAL_STORE_CODE_TEXT.uploadHeader}
                </Heading>
                {wasmFile ? (
                  <UploadCard
                    deleteFile={() => {
                      uploadSectionSetValue("wasmFile", undefined);
                    }}
                    file={wasmFile}
                  />
                ) : (
                  <DropZone
                    fileType={["wasm"]}
                    setFiles={(files: File[]) =>
                      uploadSectionSetValue("wasmFile", files[0])
                    }
                  />
                )}

                {/* Code hash  */}
                <CodeHashBox codeHash={codeHash} />
                {/* Unpin code  */}
                <Flex alignItems="center" gap={1} direction="row">
                  <Checkbox
                    onChange={(e) => {
                      trackUseUnpin(e.target.checked);
                      setValue("unpinCode", e.target.checked);
                    }}
                  >
                    {PROPOSAL_STORE_CODE_TEXT.unpinLabel}
                  </Checkbox>
                  <Tooltip
                    label={PROPOSAL_STORE_CODE_TEXT.unpinTooltip}
                    maxW="440px"
                  >
                    <CustomIcon name="info-circle" boxSize={3} color="white" />
                  </Tooltip>
                </Flex>

                {/* Builder  */}
                <ControllerInput
                  helperText={PROPOSAL_STORE_CODE_TEXT.builderHelperText}
                  label={PROPOSAL_STORE_CODE_TEXT.builderLabel}
                  name="builder"
                  // Builder is a docker image, can be tagged, digested, or both
                  rules={{
                    pattern: PROPOSAL_STORE_CODE_TEXT.builderPattern,
                    required: PROPOSAL_STORE_CODE_TEXT.builderRequired,
                  }}
                  variant="fixed-floating"
                  control={control}
                  error={
                    builder &&
                    !builder.match(PROPOSAL_STORE_CODE_TEXT.builderPattern)
                      ? PROPOSAL_STORE_CODE_TEXT.builderError
                      : errors.builder?.message
                  }
                  labelBgColor="background.main"
                  placeholder={PROPOSAL_STORE_CODE_TEXT.builderPlaceholder}
                />

                {/* Source  */}
                <ControllerInput
                  helperText={PROPOSAL_STORE_CODE_TEXT.sourceHelperText}
                  label={PROPOSAL_STORE_CODE_TEXT.sourceLabel}
                  name="source"
                  rules={{
                    pattern: PROPOSAL_STORE_CODE_TEXT.sourcePattern,
                    required: PROPOSAL_STORE_CODE_TEXT.sourceRequired,
                  }}
                  variant="fixed-floating"
                  control={control}
                  error={
                    // Source should be absolute url or absolute path
                    source &&
                    !source.match(PROPOSAL_STORE_CODE_TEXT.sourcePattern)
                      ? PROPOSAL_STORE_CODE_TEXT.sourceHelperText
                      : errors.source?.message
                  }
                  labelBgColor="background.main"
                  placeholder={PROPOSAL_STORE_CODE_TEXT.sourcePlaceholder}
                />
                {/* Instantiate permission  */}
                <Flex pt={12} direction="column">
                  <Heading as="h6" my={2} variant="h6" fontWeight={600}>
                    {PROPOSAL_STORE_CODE_TEXT.permissionTitle}
                  </Heading>
                  <Text mb={4} variant="body2" color="text.dark">
                    {PROPOSAL_STORE_CODE_TEXT.permissionDescription}
                  </Text>
                  <InstantiatePermissionRadio
                    setValue={uploadSectionSetValue}
                    trigger={uploadSectionTrigger}
                    control={uploadSectionControl}
                  />
                </Flex>
                {/* Deposit  */}
                <InitialDeposit govParams={govParams} />
                <Grid py={6} columnGap={4} templateColumns="1fr 3fr">
                  <AssetBox baseDenom={initialDeposit.denom} />
                  <ControllerInput
                    label="Amount"
                    name="initialDeposit.amount"
                    type="decimal"
                    variant="fixed-floating"
                    control={control}
                    helperAction={
                      <Text
                        minW={16}
                        mr={3}
                        textAlign="right"
                        variant="body3"
                        color="primary.main"
                        cursor="pointer"
                        fontWeight="600"
                        onClick={() => {
                          if (!minDeposit) return;
                          trackUseDepositFill(minDeposit.formattedAmount);
                          setValue(
                            "initialDeposit.amount",
                            minDeposit.formattedAmount
                          );
                        }}
                      >
                        Fill {minDeposit?.formattedToken}
                      </Text>
                    }
                    placeholder="0.00"
                  />
                </Grid>

                {/* Alert  */}
                <Alert gap="2" variant={variant} w="inherit">
                  {icon}
                  <AlertDescription>{description}</AlertDescription>
                </Alert>
                <Box>
                  {/* Transaction fee  */}
                  {(simulateStatus.status !== "default" || isSimulating) && (
                    <SimulateMessageRender
                      isSuccess={simulateStatus.status === "succeeded"}
                      mb={2}
                      value={
                        isSimulating
                          ? "Checking Wasm file and proposal conditions validity"
                          : simulateStatus.message
                      }
                      isLoading={isSimulating}
                    />
                  )}
                  <Flex
                    alignItems="center"
                    alignSelf="flex-start"
                    display="flex"
                    gap={1}
                    color="text.dark"
                    fontSize="14px"
                  >
                    Transaction Fee:{" "}
                    <EstimatedFeeRender
                      estimatedFee={estimatedFee}
                      loading={isSimulating}
                    />
                  </Flex>
                </Box>
              </Flex>
            </form>
          </GridItem>

          {/* Sticky Sidebar  */}
          <GridItem area="sidebar">
            <StickySidebar
              metadata={SIDEBAR_STORE_CODE_DETAILS(
                prettyName,
                uploadAccessParams?.isPermissionedNetwork
                  ? "permissioned"
                  : "permissionless"
              )}
              hasForumAlert
              marginTop="128px"
            />
          </GridItem>
        </Grid>
      </PageContainer>

      <Footer
        isDisabled={isSimulating || !estimatedFee || !enabledTx}
        isLoading={processing}
        onSubmit={proceed}
      />
    </>
  );
};

export default StoreCodeProposal;
