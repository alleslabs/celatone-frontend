import type { Coin, StdFee } from "@cosmjs/stargate";
import type { BechAddr } from "lib/types";

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
import { useSimulateFeeQuery } from "lib/services/tx";
import { useUploadAccessParamsRest } from "lib/services/wasm/code";
import { AccessConfigPermission } from "lib/types";
import { composeSubmitWhitelistProposalMsg, getAmountToVote } from "lib/utils";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { AssetBox, Footer } from "../components";
import { InitialDeposit } from "../components/InitialDeposit";
import { PermissionlessAlert } from "../components/PermissionlessAlert";
import { SIDEBAR_WHITELIST_DETAILS } from "../constants";
import { getAlert } from "../utils";

interface WhiteListState {
  addresses: { address: BechAddr }[];
  description: string;
  initialDeposit: Coin;
  title: string;
}

const defaultValues: WhiteListState = {
  addresses: [{ address: "" as BechAddr }],
  description: "",
  initialDeposit: { amount: "", denom: "" } as Coin,
  title: "",
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
  const { data: uploadAccessParams } = useUploadAccessParamsRest();
  const submitProposalTx = useSubmitWhitelistProposalTx();
  const { broadcast } = useTxBroadcast();
  const {
    control,
    formState: { errors: formErrors },
    reset,
    setValue,
    trigger,
    watch,
  } = useForm<WhiteListState>({
    defaultValues,
    mode: "all",
  });

  const [estimatedFee, setEstimatedFee] = useState<StdFee>();
  const [simulateError, setSimulateError] = useState<string>();
  const [processing, setProcessing] = useState(false);
  const { addresses, description, initialDeposit, title } = watch();
  const { append, fields, remove } = useFieldArray({
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
        changesValue: JSON.stringify({
          addresses:
            uploadAccessParams?.codeUploadAccess.addresses?.concat(
              addressesArray
            ),
          permission: uploadAccessParams?.isPermissionedNetwork
            ? AccessConfigPermission.ANY_OF_ADDRESSES
            : AccessConfigPermission.EVERYBODY,
        }),
        description,
        initialDeposit,
        precision: minDeposit?.precision,
        proposer: walletAddress,
        title,
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
    onError: (e) => {
      setSimulateError(e.message);
      setEstimatedFee(undefined);
    },
    onSuccess: (fee) => {
      if (fee) {
        setSimulateError(undefined);
        setEstimatedFee(fabricateFee(fee));
      } else setEstimatedFee(undefined);
    },
  });

  const {
    description: alertDesc,
    icon,
    variant,
  } = getAlert(
    initialDeposit.amount,
    govParams?.depositParams.minInitialDeposit,
    minDeposit?.formattedAmount,
    minDeposit?.formattedDenom
  );

  const proceed = useCallback(async () => {
    const stream = await submitProposalTx({
      amountToVote: getAmountToVote(initialDeposit, minDeposit),
      estimatedFee,
      messages: submitWhitelistProposalMsg,
      onTxFailed: () => setProcessing(false),

      onTxSucceed: () => setProcessing(false),
      whitelistNumber: addressesArray.length,
    });
    trackUseSubmitProposal({
      addressesCount: addresses.length,
      assetDenom: initialDeposit.denom,
      initialDeposit: initialDeposit.amount,
      minDeposit: minDeposit?.formattedAmount,
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
        initialDeposit: { amount: "", denom: minDeposit.denom },
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
          templateAreas={`"prespace alert alert postspace" "prespace main sidebar postspace"`}
          templateColumns="1fr 6fr 4fr 1fr"
        >
          {!uploadAccessParams?.isPermissionedNetwork && (
            <GridItem className="permissionless-alert" area="alert" mb={10}>
              <PermissionlessAlert />
            </GridItem>
          )}
          <GridItem area="main">
            <Heading as="h5" variant="h5">
              Create proposal to whitelist
            </Heading>
            <Text color="text.dark" fontWeight={500} mt={4} variant="body2">
              Allowed addresses will be able to upload and stored code without
              opening proposal
            </Text>
            <ConnectWalletAlert
              mt={12}
              subtitle="You need to connect wallet to proceed this action"
            />
            <form>
              <Flex
                bgColor="gray.900"
                borderRadius="8px"
                flexDirection="column"
                gap={6}
                mt={12}
                p={4}
              >
                <Flex alignItems="center" gap={2}>
                  <CustomIcon color="gray.600" name="proposal" />
                  <Heading as="h6" variant="h6">
                    Fill in proposal details
                  </Heading>
                </Flex>
                <ControllerInput
                  control={control}
                  error={
                    title.length > constants.maxProposalTitleLength
                      ? getMaxLengthError(title.length, "proposal_title")
                      : formErrors.title?.message
                  }
                  label="Proposal title"
                  labelBgColor="gray.900"
                  name="title"
                  placeholder="ex. Allow XYZ to store code without proposal"
                  rules={{
                    maxLength: constants.maxProposalTitleLength,
                    required: "Proposal Title is required",
                  }}
                  variant="fixed-floating"
                />
                <ControllerTextarea
                  control={control}
                  error={formErrors.description?.message}
                  height="160px"
                  label="Proposal description"
                  labelBgColor="gray.900"
                  name="description"
                  placeholder="Please describe your proposal for whitelist. Include all relevant details such as the project you work on or addresses you want to add to the allow list and the reason for the proposal. The description should be clear and concise to help everyone understand your request."
                  rules={{
                    required: "Proposal Description is required",
                  }}
                  variant="fixed-floating"
                />
              </Flex>
              <Heading as="h6" mt={12} variant="h6">
                Addresses to be allowed to store code
              </Heading>
              <Text color="text.dark" fontWeight={500} my={2} variant="body2">
                If the proposal is passed, these addresses will be allowed to
                upload and store code without opening proposal
              </Text>
              {fields.map((field, idx) => (
                <Flex key={field.id} gap={2} my={6}>
                  <AddressInput
                    control={control}
                    error={formErrors.addresses?.[idx]?.address?.message}
                    helperAction={
                      <AssignMe
                        isDisable={
                          addresses.findIndex(
                            (x) => x.address === walletAddress
                          ) > -1
                        }
                        onClick={() => {
                          track(AmpEvent.USE_ASSIGN_ME);
                          setValue(
                            `addresses.${idx}.address`,
                            walletAddress ?? ("" as BechAddr)
                          );
                          trigger(`addresses.${idx}.address`);
                        }}
                      />
                    }
                    label="Address"
                    name={`addresses.${idx}.address`}
                    validation={{
                      duplicate: () =>
                        addresses.find(
                          (addressObj, i) =>
                            i < idx &&
                            addressObj.address === addresses[idx].address
                        ) && "You already input this address",
                      whitelisted: () =>
                        uploadAccessParams?.codeUploadAccess.addresses?.includes(
                          addresses[idx].address
                        )
                          ? "This address is already included in whitelist"
                          : undefined,
                    }}
                    variant="fixed-floating"
                  />
                  <Button
                    h="56px"
                    isDisabled={fields.length <= 1}
                    p={0}
                    size="lg"
                    variant="outline-gray"
                    w="56px"
                    onClick={() => remove(idx)}
                  >
                    <CustomIcon boxSize={4} name="delete" />
                  </Button>
                </Flex>
              ))}
              <Button
                leftIcon={<CustomIcon name="plus" />}
                mt={3}
                variant="outline-primary"
                onClick={() => append({ address: "" as BechAddr })}
              >
                Add More Address
              </Button>
              <InitialDeposit govParams={govParams} />
              <Grid columnGap={4} py={6} templateColumns="1fr 3fr">
                <AssetBox baseDenom={initialDeposit.denom} />
                <ControllerInput
                  control={control}
                  helperAction={
                    <Text
                      color="primary.main"
                      cursor="pointer"
                      fontWeight={700}
                      minW={16}
                      mr={3}
                      textAlign="right"
                      variant="body3"
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
                  label="Amount"
                  name="initialDeposit.amount"
                  placeholder="0.00"
                  type="decimal"
                  variant="fixed-floating"
                />
              </Grid>
              <Alert gap={2} variant={variant}>
                {icon}
                <AlertDescription>{alertDesc}</AlertDescription>
              </Alert>
              <Flex
                alignItems="center"
                alignSelf="flex-start"
                color="text.dark"
                display="flex"
                fontSize="14px"
                gap={1}
                mt={12}
              >
                <p>Transaction fee:</p>
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
        isLoading={processing}
        onSubmit={proceed}
      />
    </>
  );
};

export default ProposalToWhitelist;
