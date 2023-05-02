import {
  Flex,
  Heading,
  Text,
  Alert,
  Grid,
  GridItem,
  AlertDescription,
  Checkbox,
  Box,
} from "@chakra-ui/react";
import { Sha256 } from "@cosmjs/crypto";
import type { Coin, StdFee } from "@cosmjs/stargate";
import { useWallet } from "@cosmos-kit/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { AssetBox, Footer } from "../components";
import {
  SIDEBAR_STORE_CODE_DETAILS,
  PROPOSAL_STORE_CODE_TEXT,
} from "../constants";
import { getAlert } from "../utils";
import {
  useCelatoneApp,
  useFabricateFee,
  useSimulateFeeForProposalStoreCode,
  useSubmitStoreCodeProposalTx,
  useValidateAddress,
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
import { TooltipComponent } from "lib/components/TooltipComponent";
import { InstantiatePermissionRadio } from "lib/components/upload/InstantiatePermissionRadio";
import { SimulateMessageRender } from "lib/components/upload/SimulateMessageRender";
import { UploadCard } from "lib/components/upload/UploadCard";
import {
  getMaxProposalTitleLengthError,
  MAX_PROPOSAL_TITLE_LENGTH,
} from "lib/data";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import { useGovParams } from "lib/services/proposalService";
import type {
  Addr,
  HumanAddr,
  SimulateStatus,
  UploadSectionState,
} from "lib/types";
import { AccessType } from "lib/types";
import { composeStoreCodeProposalMsg, getAmountToVote } from "lib/utils";

interface StoreCodeProposalState {
  title: string;
  proposalDesc: string;
  runAs: string;
  initialDeposit: Coin;
  unpinCode: boolean;
  builder: string;
  source: string;
  codeHash: string;
}

const defaultValues: StoreCodeProposalState = {
  title: "",
  proposalDesc: "",
  runAs: "",
  initialDeposit: { denom: "", amount: "" } as Coin,
  unpinCode: false,
  builder: "",
  source: "",
  codeHash: "",
};

// TODO - add amp track
const StoreCodeProposal = () => {
  const {
    appHumanAddress: { example: exampleHumanAddress },
  } = useCelatoneApp();
  const { address: walletAddress = "" } = useWallet();
  const fabricateFee = useFabricateFee();
  const { data: govParams } = useGovParams();
  const minDeposit = govParams?.depositParams.min_deposit;
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
  } = useForm<UploadSectionState>({
    defaultValues: {
      wasmFile: undefined,
      codeName: "",
      permission: AccessType.ACCESS_TYPE_EVERYBODY,
      addresses: [{ address: "" as Addr }],
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

  const { variant, description, icon } = getAlert(
    initialDeposit.amount,
    minDeposit?.formattedAmount,
    minDeposit?.formattedDenom
  );

  const formErrorsKey = Object.keys(errors);

  // Should not simulate when permission is any of addresses and address input is not filled, invalid, or empty
  const shouldNotSimulateForAnyOfAddr = useMemo(
    () =>
      permission === AccessType.ACCESS_TYPE_ANY_OF_ADDRESSES &&
      (addresses.some((addr) => addr.address.trim().length === 0) ||
        addresses.some((addr) =>
          Boolean(
            validateUserAddress(addr.address) &&
              validateContractAddress(addr.address)
          )
        )),

    [
      addresses,
      permission,
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
          !formErrorsKey.length
      ),
    [formErrorsKey.length, isAllInputFilled, shouldNotSimulateForAnyOfAddr]
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
    if (wasmFile) {
      const wasmFileBytes = new Sha256(
        new Uint8Array(await wasmFile.arrayBuffer())
      ).digest();
      setValue("codeHash", Buffer.from(wasmFileBytes).toString("hex"));
    } else {
      setValue("codeHash", "");
    }
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
    const submitStoreCodeProposalMsg = async () => {
      return composeStoreCodeProposalMsg({
        proposer: walletAddress as HumanAddr,
        title,
        description: proposalDesc,
        runAs,
        wasmByteCode: new Uint8Array(await wasmFile.arrayBuffer()),
        permission,
        addresses: addresses.map((addr) => addr.address),
        unpinCode,
        source,
        builder,
        codeHash: Uint8Array.from(Buffer.from(codeHash, "hex")),
        initialDeposit,
      });
    };

    const craftMsg = await submitStoreCodeProposalMsg();

    const stream = await submitStoreCodeProposalTx({
      estimatedFee,
      messages: [craftMsg],
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
          templateColumns="1fr 45% 4fr 1fr"
          gap={4}
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
                  variant="floating"
                  rules={{
                    required: PROPOSAL_STORE_CODE_TEXT.titleRequired,
                    maxLength: MAX_PROPOSAL_TITLE_LENGTH,
                  }}
                  error={
                    errors.title?.message ||
                    getMaxProposalTitleLengthError(title.length)
                  }
                />

                {/* Description  */}
                <ControllerTextarea
                  name="proposalDesc"
                  control={control}
                  height="160px"
                  label={PROPOSAL_STORE_CODE_TEXT.descriptionLabel}
                  placeholder={PROPOSAL_STORE_CODE_TEXT.descriptionPlaceholder}
                  variant="floating"
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
                  placeholder={`ex. ${exampleHumanAddress}`}
                  variant="floating"
                  helperText={PROPOSAL_STORE_CODE_TEXT.runAsHelperText}
                  reequiredText={PROPOSAL_STORE_CODE_TEXT.runAsRequired}
                  error={errors.runAs?.message}
                  helperAction={
                    <AssignMe
                      onClick={
                        walletAddress
                          ? () => {
                              AmpTrack(AmpEvent.USE_ASSIGN_ME);
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
                  />
                )}

                {/* Code hash  */}
                <Flex
                  border="1px"
                  borderRadius="5px"
                  position="relative"
                  px={3}
                  py={4}
                  borderColor="pebble.700"
                  bg="pebble.800"
                  h="56px"
                  overflowX="auto"
                >
                  <Text
                    position="absolute"
                    variant="body2"
                    color="text.dark"
                    px="1px"
                    top="-10px"
                  >
                    {PROPOSAL_STORE_CODE_TEXT.codeHashHeader}
                  </Text>
                  <Text>{codeHash}</Text>
                </Flex>

                {/* Unpin code  */}
                <Flex direction="row" alignItems="center" gap={1}>
                  <Checkbox
                    onChange={(e) => setValue("unpinCode", e.target.checked)}
                  >
                    {PROPOSAL_STORE_CODE_TEXT.unpinLabel}
                  </Checkbox>
                  <TooltipComponent
                    label={PROPOSAL_STORE_CODE_TEXT.unpinTooltip}
                    maxW="440px"
                  >
                    <div>
                      <CustomIcon
                        name="info-circle"
                        boxSize="3"
                        color="white"
                      />
                    </div>
                  </TooltipComponent>
                </Flex>

                {/* Builder  */}
                <ControllerInput
                  name="builder"
                  control={control}
                  placeholder={PROPOSAL_STORE_CODE_TEXT.builderPlaceholder}
                  label={PROPOSAL_STORE_CODE_TEXT.builderLabel}
                  labelBgColor="background.main"
                  variant="floating"
                  rules={{
                    required: PROPOSAL_STORE_CODE_TEXT.builderRequired,
                  }}
                  error={errors.builder?.message}
                />

                {/* Source  */}
                <ControllerInput
                  name="source"
                  control={control}
                  placeholder={PROPOSAL_STORE_CODE_TEXT.sourcePlaceholder}
                  label={PROPOSAL_STORE_CODE_TEXT.sourceLabel}
                  labelBgColor="background.main"
                  variant="floating"
                  helperText={PROPOSAL_STORE_CODE_TEXT.sourceHelperText}
                  rules={{
                    required: PROPOSAL_STORE_CODE_TEXT.sourceRequired,
                    pattern: /^(?!:)[a-zA-Z0-9+.-]+:/,
                  }}
                  error={
                    // Source should be absolute url or absolute path
                    source && !source.match(/^(?!:)[a-zA-Z0-9+.-]+:/)
                      ? PROPOSAL_STORE_CODE_TEXT.sourceHelperText
                      : errors.source?.message
                  }
                />

                {/* Instantiate permission  */}
                <Heading as="h6" variant="h6" pt={12}>
                  {PROPOSAL_STORE_CODE_TEXT.permissionTitle}
                </Heading>
                <Text color="text.dark" pb={2}>
                  {PROPOSAL_STORE_CODE_TEXT.permissionDescription}
                </Text>
                <InstantiatePermissionRadio
                  control={uploadSectionControl}
                  setValue={uploadSectionSetValue}
                  trigger={uploadSectionTrigger}
                />

                {/* Deposit  */}
                <Heading as="h6" variant="h6" mt={12}>
                  Initial Deposit
                </Heading>
                <Text color="text.dark" mt={2} fontWeight={500} variant="body2">
                  Minimum deposit required to start 7-day voting period:{" "}
                  {minDeposit?.formattedToken}
                </Text>
                <Grid py={6} columnGap={4} templateColumns="1fr 3fr">
                  <AssetBox baseDenom={initialDeposit.denom} />
                  <ControllerInput
                    name="initialDeposit.amount"
                    control={control}
                    label="Amount"
                    placeholder="0.00"
                    variant="floating"
                    type="number"
                    helperAction={
                      <Text
                        textAlign="right"
                        mr={3}
                        fontWeight="600"
                        cursor="pointer"
                        variant="body3"
                        minW={16}
                        color="honeydew.main"
                        onClick={() => {
                          if (!minDeposit) return;
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
              marginTop="128px"
              metadata={SIDEBAR_STORE_CODE_DETAILS}
            />
          </GridItem>
        </Grid>
      </PageContainer>

      <Footer
        disabled={isSimulating || !estimatedFee || !enabledTx}
        onSubmit={proceed}
        isLoading={processing}
      />
    </>
  );
};

export default StoreCodeProposal;
