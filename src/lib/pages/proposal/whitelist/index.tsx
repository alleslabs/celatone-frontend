import {
  Flex,
  Heading,
  Text,
  Grid,
  GridItem,
  Button,
  Alert,
  AlertDescription,
} from "@chakra-ui/react";
import type { Coin, StdFee } from "@cosmjs/stargate";
import { useWallet } from "@cosmos-kit/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { AssetBox, Footer } from "../components";
import { InitialDeposit } from "../components/InitialDeposit";
import { TestnetAlert } from "../components/TestnetAlert";
import { SIDEBAR_WHITELIST_DETAILS } from "../constants";
import { getAlert } from "../utils";
import {
  useCurrentNetwork,
  useFabricateFee,
  useSimulateFeeQuery,
  useSubmitWhitelistProposalTx,
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
import {
  getMaxProposalTitleLengthError,
  MAX_PROPOSAL_TITLE_LENGTH,
} from "lib/data/proposalWhitelist";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import {
  AmpEvent,
  AmpTrack,
  AmpTrackUseSubmitProposal,
  AmpTrackUseWhitelistedAddresses,
  AmpTrackUseDepositFill,
} from "lib/services/amplitude";
import { useGovParams } from "lib/services/proposalService";
import type { Addr } from "lib/types";
import { composeSubmitWhitelistProposalMsg, getAmountToVote } from "lib/utils";

interface WhiteListState {
  title: string;
  description: string;
  addresses: { address: Addr }[];
  initialDeposit: Coin;
}

const defaultValues: WhiteListState = {
  title: "",
  description: "",
  addresses: [{ address: "" as Addr }],
  initialDeposit: { denom: "", amount: "" } as Coin,
};

const ampPage = "proposal_whitelist";

const ProposalToWhitelist = () => {
  const router = useRouter();
  const { address: walletAddress = "" } = useWallet();
  const fabricateFee = useFabricateFee();
  const { data: govParams } = useGovParams();
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
  const { isTestnet } = useCurrentNetwork();

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

  const submitWhitelistProposalMsg = useMemo(
    () =>
      composeSubmitWhitelistProposalMsg({
        title,
        description,
        changesValue: JSON.stringify({
          ...govParams?.uploadAccess,
          addresses: govParams?.uploadAccess.addresses?.concat(addressesArray),
        }),
        initialDeposit,
        proposer: walletAddress as Addr,
        precision: minDeposit?.precision,
      }),
    [
      addressesArray,
      description,
      govParams?.uploadAccess,
      initialDeposit,
      minDeposit,
      title,
      walletAddress,
    ]
  );

  const { isFetching: isSimulating } = useSimulateFeeQuery({
    enabled: enabledTx,
    messages: [submitWhitelistProposalMsg],
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
      messages: [submitWhitelistProposalMsg],
      whitelistNumber: addressesArray.length,
      amountToVote: getAmountToVote(initialDeposit, minDeposit),

      onTxSucceed: () => setProcessing(false),
      onTxFailed: () => setProcessing(false),
    });
    AmpTrackUseSubmitProposal(ampPage, {
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
    AmpTrackUseWhitelistedAddresses(
      ampPage,
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
      AmpTrack(AmpEvent.TO_PROPOSAL_TO_WHITELIST);
    }
  }, [router.isReady]);

  return (
    <>
      <PageContainer>
        <Grid
          templateAreas={`"prespace alert alert postspace" "prespace main sidebar postspace"`}
          templateColumns="1fr 6fr 4fr 1fr"
          sx={
            isTestnet
              ? {
                  "> div:not(.testnet-alert)": {
                    opacity: 0.5,
                    pointerEvents: "none",
                  },
                }
              : undefined
          }
        >
          {isTestnet && (
            <GridItem area="alert" className="testnet-alert" mb={10}>
              <TestnetAlert />
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
              page={ampPage}
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
                  variant="floating"
                  rules={{
                    required: "Proposal Title is required",
                    maxLength: MAX_PROPOSAL_TITLE_LENGTH,
                  }}
                  error={
                    formErrors.title?.message ||
                    getMaxProposalTitleLengthError(title.length)
                  }
                />
                <ControllerTextarea
                  name="description"
                  control={control}
                  height="160px"
                  label="Proposal Description"
                  placeholder="Please describe your proposal for whitelist. Include all relevant details such as the project you work on or addresses you want to add to the allow list and the reason for the proposal. The description should be clear and concise to help everyone understand your request."
                  variant="floating"
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
                    variant="floating"
                    validation={{
                      duplicate: () =>
                        addresses.find(
                          (addressObj, i) =>
                            i < idx &&
                            addressObj.address === addresses[idx].address
                        ) && "You already input this address",
                      whitelisted: () =>
                        govParams?.uploadAccess.addresses?.includes(
                          addresses[idx].address
                        )
                          ? "This address is already included in whitelist"
                          : undefined,
                    }}
                    error={formErrors.addresses?.[idx]?.address?.message}
                    helperAction={
                      <AssignMe
                        onClick={() => {
                          AmpTrack(AmpEvent.USE_ASSIGN_ME);
                          setValue(
                            `addresses.${idx}.address`,
                            walletAddress as Addr
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
                    disabled={fields.length <= 1}
                    onClick={() => remove(idx)}
                  >
                    <CustomIcon name="delete" />
                  </Button>
                </Flex>
              ))}
              <Button
                variant="outline-primary"
                mt={3}
                onClick={() => append({ address: "" as Addr })}
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
                  variant="floating"
                  type="number"
                  helperAction={
                    <Text
                      textAlign="right"
                      mr={3}
                      fontWeight={700}
                      cursor="pointer"
                      variant="body3"
                      minW={16}
                      color="accent.main"
                      onClick={() => {
                        if (!minDeposit) return;
                        AmpTrackUseDepositFill(
                          ampPage,
                          minDeposit.formattedAmount
                        );
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
              metadata={SIDEBAR_WHITELIST_DETAILS}
            />
          </GridItem>
        </Grid>
      </PageContainer>
      <Footer
        disabled={isSimulating || !enabledTx || !estimatedFee}
        onSubmit={proceed}
        isLoading={processing}
      />
    </>
  );
};

export default ProposalToWhitelist;
