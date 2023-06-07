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
import big from "big.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { AssetBox, Footer } from "../components";
import { PermissionlessAlert } from "../components/PermissionlessAlert";
import { SIDEBAR_DETAILS } from "../constants";
import { getAlert } from "../utils";
import {
  useCelatoneApp,
  useFabricateFee,
  useSimulateFeeQuery,
  useSubmitProposalTx,
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
import { useGetMaxLengthError } from "lib/hooks";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import { useGovParams } from "lib/services/proposalService";
import type { Addr } from "lib/types";
import { AccessConfigPermission } from "lib/types";
import { composeSubmitWhitelistProposalMsg, d2Formatter } from "lib/utils";

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

const ProposalToWhitelist = () => {
  const { constants } = useCelatoneApp();
  const getMaxLengthError = useGetMaxLengthError();
  const { address: walletAddress = "" } = useWallet();
  const {
    chainConfig: { prettyName },
  } = useCelatoneApp();
  const fabricateFee = useFabricateFee();
  const { data: govParams } = useGovParams();
  const submitProposalTx = useSubmitProposalTx();
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

  const isPermissionless =
    govParams?.uploadAccess.permission === AccessConfigPermission.EVERYBODY;
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
      }),
    [
      addressesArray,
      description,
      govParams?.uploadAccess,
      initialDeposit,
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
  const minDeposit = govParams?.depositParams.min_deposit;
  const {
    variant,
    description: alertDesc,
    icon,
  } = getAlert(
    initialDeposit.amount,
    minDeposit?.formattedAmount,
    minDeposit?.formattedDenom
  );

  const proceed = useCallback(async () => {
    const minDepositAmount = big(minDeposit?.formattedAmount || 0);
    const stream = await submitProposalTx({
      estimatedFee,
      messages: [submitWhitelistProposalMsg],
      whitelistNumber: addressesArray.length,
      amountToVote: minDepositAmount.lte(initialDeposit.amount)
        ? null
        : // TODO: Refactor this logic into utils?
          `${d2Formatter(
            minDepositAmount.minus(initialDeposit.amount),
            "NaN"
          )} ${minDeposit?.formattedDenom}`,
      onTxSucceed: () => setProcessing(false),
      onTxFailed: () => setProcessing(false),
    });
    if (stream) {
      setProcessing(true);
      broadcast(stream);
    }
  }, [
    addressesArray.length,
    submitWhitelistProposalMsg,
    estimatedFee,
    initialDeposit.amount,
    minDeposit,
    broadcast,
    submitProposalTx,
  ]);

  useEffect(() => {
    if (minDeposit)
      reset({
        ...defaultValues,
        initialDeposit: { denom: minDeposit.denom, amount: "" },
      });
  }, [minDeposit, reset]);

  return (
    <>
      <PageContainer>
        <Grid
          templateAreas={`"prespace alert alert postspace" "prespace main sidebar postspace"`}
          templateColumns="1fr 6fr 4fr 1fr"
          sx={
            isPermissionless
              ? {
                  "> div:not(.permissionless-alert)": {
                    opacity: 0.5,
                    pointerEvents: "none",
                  },
                }
              : undefined
          }
        >
          {isPermissionless && (
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
                bgColor="pebble.900"
                flexDirection="column"
                borderRadius="8px"
              >
                <Flex gap={2} alignItems="center">
                  <CustomIcon name="proposal-solid" />
                  <Heading as="h6" variant="h6">
                    Fill in Proposal Details
                  </Heading>
                </Flex>
                <ControllerInput
                  name="title"
                  control={control}
                  placeholder="ex. Allow XYZ to store code without proposal"
                  label="Proposal Title"
                  labelBgColor="pebble.900"
                  variant="floating"
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
                  variant="floating"
                  labelBgColor="pebble.900"
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
                    <CustomIcon
                      name="delete"
                      color={fields.length <= 1 ? "pebble.600" : "text.dark"}
                    />
                  </Button>
                </Flex>
              ))}
              <Button
                variant="outline-primary"
                mt={3}
                onClick={() => append({ address: "" as Addr })}
                leftIcon={<CustomIcon name="plus" color="violet.light" />}
              >
                Add More Address
              </Button>
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
              metadata={SIDEBAR_DETAILS(
                prettyName,
                isPermissionless ? "permissionless" : "permissioned"
              )}
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
