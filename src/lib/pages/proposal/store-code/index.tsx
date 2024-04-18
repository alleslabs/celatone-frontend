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
  useSimulateFeeForProposalStoreCode,
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
import { CodeHashBox } from "lib/components/upload/CodeHashBox";
import { InstantiatePermissionRadio } from "lib/components/upload/InstantiatePermissionRadio";
import { SimulateMessageRender } from "lib/components/upload/SimulateMessageRender";
import { UploadCard } from "lib/components/upload/UploadCard";
import { useGetMaxLengthError } from "lib/hooks";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import { useGovParams } from "lib/services/proposalService";
import type { BechAddr, SimulateStatus, UploadSectionState } from "lib/types";
import { AccessConfigPermission, AccessType } from "lib/types";
import {
  composeStoreCodeProposalMsg,
  getAmountToVote,
  getCodeHash,
} from "lib/utils";

interface StoreCodeProposalState {
  title: string;
  proposalDesc: string;
  runAs: BechAddr;
  initialDeposit: Coin;
  unpinCode: boolean;
  builder: string;
  source: string;
  codeHash: string;
}

const defaultValues: StoreCodeProposalState = {
  title: "",
  proposalDesc: "",
  runAs: "" as BechAddr,
  initialDeposit: { denom: "", amount: "" } as Coin,
  unpinCode: false,
  builder: "",
  source: "",
  codeHash: "",
};

const StoreCodeProposal = () => {
  useWasmConfig({ shouldRedirect: true });
  const {
    constants,
    chainConfig: { prettyName },
  } = useCelatoneApp();
  const { user: exampleUserAddress } = useExampleAddresses();
  const getMaxLengthError = useGetMaxLengthError();
  const { address: walletAddress } = useCurrentChain();
  const fabricateFee = useFabricateFee();
  const { data: govParams } = useGovParams();
  const minDeposit = govParams?.depositParams.minDeposit;
  const isPermissionless =
    govParams?.uploadAccess.permission === AccessConfigPermission.EVERYBODY;
  const { validateUserAddress, validateContractAddress } = useValidateAddress();
  const submitStoreCodeProposalTx = useSubmitStoreCodeProposalTx();
  const { broadcast } = useTxBroadcast();

  // States
  const [estimatedFee, setEstimatedFee] = useState<StdFee>();
  const [processing, setProcessing] = useState(false);
  const [simulateStatus, setSimulateStatus] = useState<SimulateStatus>({
    status: "default",
    message: "",
  });
  const {
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
    trigger,
  } = useForm<StoreCodeProposalState>({
    defaultValues,
    mode: "all",
  });
  const {
    control: uploadSectionControl,
    watch: uploadSectionWatch,
    setValue: uploadSectionSetValue,
    trigger: uploadSectionTrigger,
    formState: { errors: uploadSectionErrors },
  } = useForm<UploadSectionState>({
    defaultValues: {
      wasmFile: undefined,
      codeName: "",
      permission: AccessType.ACCESS_TYPE_EVERYBODY,
      addresses: [{ address: "" as BechAddr }],
    },
    mode: "all",
  });
  const {
    title,
    proposalDesc,
    runAs,
    initialDeposit,
    unpinCode,
    builder,
    source,
    codeHash,
  } = watch();
  const { wasmFile, permission, addresses } = uploadSectionWatch();

  // Amp
  const router = useRouter();
  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_PROPOSAL_TO_STORE_CODE);
  }, [router.isReady]);

  const { variant, description, icon } = getAlert(
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
    if (!enabledTx) setSimulateStatus({ status: "default", message: "" });
  }, [enabledTx]);

  useEffect(() => {
    if (minDeposit)
      reset({
        ...defaultValues,
        initialDeposit: { denom: minDeposit.denom, amount: "" },
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
    enabled: Boolean(walletAddress && enabledTx),
    title,
    description: proposalDesc,
    runAs,
    initialDeposit,
    unpinCode,
    builder,
    source,
    codeHash,
    wasmFile,
    permission,
    addresses: addresses.map((addr) => addr.address),
    precision: minDeposit?.precision,
    onSuccess: (fee) => {
      if (wasmFile && walletAddress && fee) {
        setSimulateStatus({
          status: "succeeded",
          message: "Valid Wasm file and submitting proposal conditions",
        });
        setEstimatedFee(fabricateFee(fee));
      }
    },
    onError: (e) => {
      setSimulateStatus({ status: "failed", message: e.message });
      setEstimatedFee(undefined);
    },
  });

  const proceed = useCallback(async () => {
    if (!wasmFile) return null;

    trackUseSubmitProposal({
      initialDeposit: initialDeposit.amount,
      assetDenom: initialDeposit.denom,
      minDeposit: minDeposit?.formattedAmount,
      addressesCount: addresses.length,
      permission: AccessType[permission],
    });

    const submitStoreCodeProposalMsg = async () => {
      if (!walletAddress) return [];
      return [
        composeStoreCodeProposalMsg({
          proposer: walletAddress,
          title,
          description: proposalDesc,
          runAs,
          wasmByteCode: await gzip(
            new Uint8Array(await wasmFile.arrayBuffer())
          ),
          permission,
          addresses: addresses.map((addr) => addr.address),
          unpinCode,
          source,
          builder,
          codeHash: Uint8Array.from(Buffer.from(codeHash, "hex")),
          initialDeposit,
          precision: minDeposit?.precision,
        }),
      ];
    };
    const craftMsg = await submitStoreCodeProposalMsg();

    const stream = await submitStoreCodeProposalTx({
      estimatedFee,
      messages: craftMsg,
      wasmFileName: wasmFile.name,
      amountToVote: getAmountToVote(initialDeposit, minDeposit),
      onTxSucceed: () => setProcessing(false),
      onTxFailed: () => setProcessing(false),
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
            <Text color="text.dark" pt={4}>
              {PROPOSAL_STORE_CODE_TEXT.description}
            </Text>
            <ConnectWalletAlert
              subtitle={PROPOSAL_STORE_CODE_TEXT.connectWallet}
              mt={12}
            />
            <form>
              <Flex my="48px" gap={6} direction="column">
                <Heading as="h6" variant="h6" mb={6}>
                  {PROPOSAL_STORE_CODE_TEXT.header}
                </Heading>

                {/* Title  */}
                <ControllerInput
                  name="title"
                  control={control}
                  placeholder={PROPOSAL_STORE_CODE_TEXT.titlePlaceholder}
                  label={PROPOSAL_STORE_CODE_TEXT.titleLabel}
                  labelBgColor="background.main"
                  variant="fixed-floating"
                  rules={{
                    required: PROPOSAL_STORE_CODE_TEXT.titleRequired,
                    maxLength: constants.maxProposalTitleLength,
                  }}
                  error={
                    title.length > constants.maxProposalTitleLength
                      ? getMaxLengthError(title.length, "proposal_title")
                      : errors.title?.message
                  }
                />

                {/* Description  */}
                <ControllerTextarea
                  name="proposalDesc"
                  control={control}
                  height="160px"
                  label={PROPOSAL_STORE_CODE_TEXT.descriptionLabel}
                  placeholder={PROPOSAL_STORE_CODE_TEXT.descriptionPlaceholder}
                  variant="fixed-floating"
                  labelBgColor="background.main"
                  rules={{
                    required: PROPOSAL_STORE_CODE_TEXT.descriptionRequired,
                  }}
                  error={errors.proposalDesc?.message}
                />

                {/* Run as  */}
                <AddressInput
                  name="runAs"
                  control={control}
                  label={PROPOSAL_STORE_CODE_TEXT.runAsLabel}
                  labelBgColor="background.main"
                  placeholder={`ex. ${exampleUserAddress}`}
                  variant="fixed-floating"
                  helperText={PROPOSAL_STORE_CODE_TEXT.runAsHelperText}
                  requiredText={PROPOSAL_STORE_CODE_TEXT.runAsRequired}
                  error={errors.runAs?.message}
                  helperAction={
                    <AssignMe
                      onClick={
                        walletAddress
                          ? () => {
                              track(AmpEvent.USE_ASSIGN_ME);
                              setValue("runAs", walletAddress);
                              trigger("runAs");
                            }
                          : undefined
                      }
                      isDisable={runAs === walletAddress}
                    />
                  }
                />

                {/* Upload file  */}
                <Heading as="h6" variant="h6" pt={12} pb={6}>
                  {PROPOSAL_STORE_CODE_TEXT.uploadHeader}
                </Heading>
                {wasmFile ? (
                  <UploadCard
                    file={wasmFile}
                    deleteFile={() => {
                      uploadSectionSetValue("wasmFile", undefined);
                    }}
                  />
                ) : (
                  <DropZone
                    setFile={(file) => uploadSectionSetValue("wasmFile", file)}
                    fileType="wasm"
                  />
                )}

                {/* Code hash  */}
                <CodeHashBox codeHash={codeHash} />
                {/* Unpin code  */}
                <Flex direction="row" alignItems="center" gap={1}>
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
                  name="builder"
                  control={control}
                  placeholder={PROPOSAL_STORE_CODE_TEXT.builderPlaceholder}
                  label={PROPOSAL_STORE_CODE_TEXT.builderLabel}
                  labelBgColor="background.main"
                  variant="fixed-floating"
                  helperText={PROPOSAL_STORE_CODE_TEXT.builderHelperText}
                  // Builder is a docker image, can be tagged, digested, or both
                  rules={{
                    required: PROPOSAL_STORE_CODE_TEXT.builderRequired,
                    pattern: PROPOSAL_STORE_CODE_TEXT.builderPattern,
                  }}
                  error={
                    builder &&
                    !builder.match(PROPOSAL_STORE_CODE_TEXT.builderPattern)
                      ? PROPOSAL_STORE_CODE_TEXT.builderError
                      : errors.builder?.message
                  }
                />

                {/* Source  */}
                <ControllerInput
                  name="source"
                  control={control}
                  placeholder={PROPOSAL_STORE_CODE_TEXT.sourcePlaceholder}
                  label={PROPOSAL_STORE_CODE_TEXT.sourceLabel}
                  labelBgColor="background.main"
                  variant="fixed-floating"
                  helperText={PROPOSAL_STORE_CODE_TEXT.sourceHelperText}
                  rules={{
                    required: PROPOSAL_STORE_CODE_TEXT.sourceRequired,
                    pattern: PROPOSAL_STORE_CODE_TEXT.sourcePattern,
                  }}
                  error={
                    // Source should be absolute url or absolute path
                    source &&
                    !source.match(PROPOSAL_STORE_CODE_TEXT.sourcePattern)
                      ? PROPOSAL_STORE_CODE_TEXT.sourceHelperText
                      : errors.source?.message
                  }
                />
                {/* Instantiate permission  */}
                <Flex direction="column" pt={12}>
                  <Heading as="h6" variant="h6" fontWeight={600} my={2}>
                    {PROPOSAL_STORE_CODE_TEXT.permissionTitle}
                  </Heading>
                  <Text color="text.dark" variant="body2" mb={4}>
                    {PROPOSAL_STORE_CODE_TEXT.permissionDescription}
                  </Text>
                  <InstantiatePermissionRadio
                    control={uploadSectionControl}
                    setValue={uploadSectionSetValue}
                    trigger={uploadSectionTrigger}
                  />
                </Flex>
                {/* Deposit  */}
                <InitialDeposit govParams={govParams} />
                <Grid py={6} columnGap={4} templateColumns="1fr 3fr">
                  <AssetBox baseDenom={initialDeposit.denom} />
                  <ControllerInput
                    name="initialDeposit.amount"
                    control={control}
                    label="Amount"
                    placeholder="0.00"
                    variant="fixed-floating"
                    type="number"
                    helperAction={
                      <Text
                        textAlign="right"
                        mr={3}
                        fontWeight="600"
                        cursor="pointer"
                        variant="body3"
                        minW={16}
                        color="accent.main"
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
                  />
                </Grid>

                {/* Alert  */}
                <Alert variant={variant} gap="2" w="inherit">
                  {icon}
                  <AlertDescription>{description}</AlertDescription>
                </Alert>
                <Box>
                  {/* Transaction fee  */}
                  {(simulateStatus.status !== "default" || isSimulating) && (
                    <SimulateMessageRender
                      value={
                        isSimulating
                          ? "Checking Wasm file and proposal conditions validity"
                          : simulateStatus.message
                      }
                      isLoading={isSimulating}
                      mb={2}
                      isSuccess={simulateStatus.status === "succeeded"}
                    />
                  )}
                  <Flex
                    fontSize="14px"
                    color="text.dark"
                    alignSelf="flex-start"
                    alignItems="center"
                    display="flex"
                    gap={1}
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
              hasForumAlert
              marginTop="128px"
              metadata={SIDEBAR_STORE_CODE_DETAILS(
                prettyName,
                isPermissionless ? "permissionless" : "permissioned"
              )}
            />
          </GridItem>
        </Grid>
      </PageContainer>

      <Footer
        isDisabled={isSimulating || !estimatedFee || !enabledTx}
        onSubmit={proceed}
        isLoading={processing}
      />
    </>
  );
};

export default StoreCodeProposal;
