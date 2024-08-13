import {
  Alert,
  AlertDescription,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
} from "@chakra-ui/react";
import type { Coin, StdFee } from "@cosmjs/stargate";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { AssetBox, Footer } from "../components";
import { InitialDeposit } from "../components/InitialDeposit";
import { PermissionlessAlert } from "../components/PermissionlessAlert";
import { SIDEBAR_WHITELIST_DETAILS } from "../constants";
import { getAlert } from "../utils";
import {
  AmpEvent,
  track,
  trackUseDepositFill,
  trackUseSubmitProposal,
  trackUseWhitelistedAddress,
} from "lib/amplitude";
import {
  useCelatoneApp,
  useCurrentChain,
  useFabricateFee,
  useSimulateFeeQuery,
  useSubmitWhitelistProposalTx,
  useWasmConfig,
} from "lib/app-provider";
import { AddressInput } from "lib/components/AddressInput";
import { AssignMe } from "lib/components/AssignMe";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { ErrorMessageRender } from "lib/components/ErrorMessageRender";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { ControllerInput, ControllerTextarea } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
import PageContainer from "lib/components/PageContainer";
import { StickySidebar } from "lib/components/StickySidebar";
import { useGetMaxLengthError, useTxBroadcast } from "lib/hooks";
import { useGovParamsDeprecated } from "lib/model/proposal";
import { useUploadAccessParamsLcd } from "lib/services/wasm/code";
import type { BechAddr } from "lib/types";
import { AccessConfigPermission } from "lib/types";
import { composeSubmitWhitelistProposalMsg, getAmountToVote } from "lib/utils";

interface WhiteListState {
  title: string;
  description: string;
  addresses: { address: BechAddr }[];
  initialDeposit: Coin;
}

const defaultValues: WhiteListState = {
  title: "",
  description: "",
  addresses: [{ address: "" as BechAddr }],
  initialDeposit: { denom: "", amount: "" } as Coin,
};

const ProposalToWhitelist = () => {
  useWasmConfig({ shouldRedirect: true });
  const router = useRouter();
  const { constants } = useCelatoneApp();
  const getMaxLengthError = useGetMaxLengthError();
  const { address: walletAddress } = useCurrentChain();
  const {
    chainConfig: { prettyName },
  } = useCelatoneApp();
  const fabricateFee = useFabricateFee();
  const { data: govParams } = useGovParamsDeprecated();
  const { data: uploadAccessParams } = useUploadAccessParamsLcd();
  const submitProposalTx = useSubmitWhitelistProposalTx();
  const { broadcast } = useTxBroadcast();
  const {
    control,
    watch,
    setValue,
    reset,
    formState: { errors: formErrors },
    trigger,
  } = useForm<WhiteListState>({
    defaultValues,
    mode: "all",
  });

  const [estimatedFee, setEstimatedFee] = useState<StdFee>();
  const [simulateError, setSimulateError] = useState<string>();
  const [processing, setProcessing] = useState(false);
  const { title, description, addresses, initialDeposit } = watch();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  const minDeposit = govParams?.depositParams.minDeposit;
  const addressesArray = addresses.map((addressObj) => addressObj.address);
  const formErrorsKey = Object.keys(formErrors);
  const enabledTx = useMemo(
    () =>
      Boolean(
        walletAddress &&
          title &&
          description &&
          addressesArray.length > 0 &&
          initialDeposit.amount &&
          !formErrorsKey.length
      ),
    [
      walletAddress,
      title,
      description,
      addressesArray,
      initialDeposit.amount,
      formErrorsKey,
    ]
  );

  const submitWhitelistProposalMsg = useMemo(() => {
    if (!walletAddress) return [];
    return [
      composeSubmitWhitelistProposalMsg({
        title,
        description,
        changesValue: JSON.stringify({
          permission: uploadAccessParams?.isPermissionedNetwork
            ? AccessConfigPermission.ANY_OF_ADDRESSES
            : AccessConfigPermission.EVERYBODY,
          addresses: uploadAccessParams?.addresses?.concat(addressesArray),
        }),
        initialDeposit,
        proposer: walletAddress,
        precision: minDeposit?.precision,
      }),
    ];
  }, [
    addressesArray,
    description,
    initialDeposit,
    minDeposit?.precision,
    title,
    uploadAccessParams,
    walletAddress,
  ]);

  const { isFetching: isSimulating } = useSimulateFeeQuery({
    enabled: enabledTx,
    messages: submitWhitelistProposalMsg,
    onSuccess: (fee) => {
      if (fee) {
        setSimulateError(undefined);
        setEstimatedFee(fabricateFee(fee));
      } else setEstimatedFee(undefined);
    },
    onError: (e) => {
      setSimulateError(e.message);
      setEstimatedFee(undefined);
    },
  });

  const {
    variant,
    description: alertDesc,
    icon,
  } = getAlert(
    initialDeposit.amount,
    govParams?.depositParams.minInitialDeposit,
    minDeposit?.formattedAmount,
    minDeposit?.formattedDenom
  );

  const proceed = useCallback(async () => {
    const stream = await submitProposalTx({
      estimatedFee,
      messages: submitWhitelistProposalMsg,
      whitelistNumber: addressesArray.length,
      amountToVote: getAmountToVote(initialDeposit, minDeposit),

      onTxSucceed: () => setProcessing(false),
      onTxFailed: () => setProcessing(false),
    });
    trackUseSubmitProposal({
      initialDeposit: initialDeposit.amount,
      assetDenom: initialDeposit.denom,
      minDeposit: minDeposit?.formattedAmount,
      addressesCount: addresses.length,
    });
    if (stream) {
      setProcessing(true);
      broadcast(stream);
    }
  }, [
    addresses.length,
    minDeposit,
    submitProposalTx,
    estimatedFee,
    submitWhitelistProposalMsg,
    addressesArray.length,
    initialDeposit,
    broadcast,
  ]);

  useEffect(() => {
    const emptyAddressesLength = addresses.filter(
      (addr) => addr.address.trim().length === 0
    ).length;
    trackUseWhitelistedAddress(
      emptyAddressesLength,
      addresses.length - emptyAddressesLength
    );
    // Run this effect only when the amount of address input changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addresses.length]);

  useEffect(() => {
    if (minDeposit)
      reset({
        ...defaultValues,
        initialDeposit: { denom: minDeposit.denom, amount: "" },
      });
  }, [minDeposit, reset]);

  useEffect(() => {
    if (router.isReady) {
      track(AmpEvent.TO_PROPOSAL_TO_WHITELIST);
    }
  }, [router.isReady]);

  return (
    <>
      <PageContainer>
        <Grid
          templateAreas={`"prespace alert alert postspace" "prespace main sidebar postspace"`}
          templateColumns="1fr 6fr 4fr 1fr"
          sx={
            uploadAccessParams?.isPermissionedNetwork
              ? undefined
              : {
                  "> div:not(.permissionless-alert)": {
                    opacity: 0.5,
                    pointerEvents: "none",
                  },
                }
          }
        >
          {!uploadAccessParams?.isPermissionedNetwork && (
            <GridItem area="alert" className="permissionless-alert" mb={10}>
              <PermissionlessAlert />
            </GridItem>
          )}
          <GridItem area="main">
            <Heading as="h5" variant="h5">
              Create Proposal to Whitelist
            </Heading>
            <Text color="text.dark" mt={4} fontWeight={500} variant="body2">
              Allowed addresses will be able to upload and stored code without
              opening proposal
            </Text>
            <ConnectWalletAlert
              subtitle="You need to connect wallet to proceed this action"
              mt={12}
            />
            <form>
              <Flex
                mt={12}
                p={4}
                gap={6}
                bgColor="gray.900"
                flexDirection="column"
                borderRadius="8px"
              >
                <Flex gap={2} alignItems="center">
                  <CustomIcon name="proposal-solid" color="gray.600" />
                  <Heading as="h6" variant="h6">
                    Fill in Proposal Details
                  </Heading>
                </Flex>
                <ControllerInput
                  name="title"
                  control={control}
                  placeholder="ex. Allow XYZ to store code without proposal"
                  label="Proposal Title"
                  labelBgColor="gray.900"
                  variant="fixed-floating"
                  rules={{
                    required: "Proposal Title is required",
                    maxLength: constants.maxProposalTitleLength,
                  }}
                  error={
                    title.length > constants.maxProposalTitleLength
                      ? getMaxLengthError(title.length, "proposal_title")
                      : formErrors.title?.message
                  }
                />
                <ControllerTextarea
                  name="description"
                  control={control}
                  height="160px"
                  label="Proposal Description"
                  placeholder="Please describe your proposal for whitelist. Include all relevant details such as the project you work on or addresses you want to add to the allow list and the reason for the proposal. The description should be clear and concise to help everyone understand your request."
                  variant="fixed-floating"
                  labelBgColor="gray.900"
                  rules={{
                    required: "Proposal Description is required",
                  }}
                  error={formErrors.description?.message}
                />
              </Flex>
              <Heading as="h6" variant="h6" mt={12}>
                Addresses to be allowed to store code
              </Heading>
              <Text color="text.dark" my={2} fontWeight={500} variant="body2">
                If the proposal is passed, these addresses will be allowed to
                upload and store code without opening proposal
              </Text>
              {fields.map((field, idx) => (
                <Flex gap={2} my={6} key={field.id}>
                  <AddressInput
                    name={`addresses.${idx}.address`}
                    control={control}
                    label="Address"
                    variant="fixed-floating"
                    validation={{
                      duplicate: () =>
                        addresses.find(
                          (addressObj, i) =>
                            i < idx &&
                            addressObj.address === addresses[idx].address
                        ) && "You already input this address",
                      whitelisted: () =>
                        uploadAccessParams?.addresses?.includes(
                          addresses[idx].address
                        )
                          ? "This address is already included in whitelist"
                          : undefined,
                    }}
                    error={formErrors.addresses?.[idx]?.address?.message}
                    helperAction={
                      <AssignMe
                        onClick={() => {
                          track(AmpEvent.USE_ASSIGN_ME);
                          setValue(
                            `addresses.${idx}.address`,
                            walletAddress ?? ("" as BechAddr)
                          );
                          trigger(`addresses.${idx}.address`);
                        }}
                        isDisable={
                          addresses.findIndex(
                            (x) => x.address === walletAddress
                          ) > -1
                        }
                      />
                    }
                  />
                  <Button
                    w="56px"
                    h="56px"
                    variant="outline-gray"
                    size="lg"
                    p={0}
                    isDisabled={fields.length <= 1}
                    onClick={() => remove(idx)}
                  >
                    <CustomIcon name="delete" boxSize={4} />
                  </Button>
                </Flex>
              ))}
              <Button
                variant="outline-primary"
                mt={3}
                onClick={() => append({ address: "" as BechAddr })}
                leftIcon={<CustomIcon name="plus" />}
              >
                Add More Address
              </Button>
              <InitialDeposit govParams={govParams} />
              <Grid py={6} columnGap={4} templateColumns="1fr 3fr">
                <AssetBox baseDenom={initialDeposit.denom} />
                <ControllerInput
                  name="initialDeposit.amount"
                  control={control}
                  label="Amount"
                  placeholder="0.00"
                  variant="fixed-floating"
                  type="decimal"
                  helperAction={
                    <Text
                      textAlign="right"
                      mr={3}
                      fontWeight={700}
                      cursor="pointer"
                      variant="body3"
                      minW={16}
                      color="primary.main"
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
              <Alert variant={variant} gap={2}>
                {icon}
                <AlertDescription>{alertDesc}</AlertDescription>
              </Alert>
              <Flex
                mt={12}
                fontSize="14px"
                color="text.dark"
                alignSelf="flex-start"
                alignItems="center"
                display="flex"
                gap={1}
              >
                <p>Transaction Fee:</p>
                <EstimatedFeeRender
                  estimatedFee={estimatedFee}
                  loading={isSimulating}
                />
              </Flex>
              {simulateError && (
                <ErrorMessageRender error={simulateError} mt={2} />
              )}
            </form>
          </GridItem>
          <GridItem area="sidebar">
            <StickySidebar
              marginTop="128px"
              metadata={SIDEBAR_WHITELIST_DETAILS(
                prettyName,
                uploadAccessParams?.isPermissionedNetwork
                  ? "permissioned"
                  : "permissionless"
              )}
            />
          </GridItem>
        </Grid>
      </PageContainer>
      <Footer
        isDisabled={isSimulating || !enabledTx || !estimatedFee}
        onSubmit={proceed}
        isLoading={processing}
      />
    </>
  );
};

export default ProposalToWhitelist;
