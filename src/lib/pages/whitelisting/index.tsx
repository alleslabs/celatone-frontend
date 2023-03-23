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
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { useNativeTokensInfo, useSimulateFee } from "lib/app-provider";
import { AddressInput } from "lib/components/AddressInput";
import { AssignMe } from "lib/components/AssignMe";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import {
  ControllerInput,
  ControllerTextarea,
  SelectInput,
} from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
import PageContainer from "lib/components/PageContainer";
import { StickySidebar } from "lib/components/StickySidebar";
import type { SimulateStatus } from "lib/components/upload/types";
import {
  getMaxProposalTitleLengthError,
  MAX_PROPOSAL_TITLE_LENGTH,
} from "lib/data/proposalWhitelist";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { Addr } from "lib/types";

import { Footer } from "./components/Footer";

interface WhiteListState {
  title: string;
  description: string;
  addresses: { address: Addr }[];
  initialDeposit: Coin;
  estimatedFee?: StdFee;
  simulateStatus: SimulateStatus;
  simulateError: string;
}

const mockUpDepositAmount = 1000.0;
const getAlert = (amount: string) => {
  const enteredAmount = amount || 0;
  if (big(enteredAmount).lt(mockUpDepositAmount)) {
    return {
      variant: "warning",
      description: `${big(mockUpDepositAmount)
        .sub(enteredAmount)
        .toFixed(
          2
        )} more KOYN is required to enter the voting period. If you proceed with this amount without further deposit after 7 days, The chain will remove your proposal with no fund return.`,
      icon: (
        <CustomIcon
          name="alert-circle-solid"
          color="warning.main"
          boxSize="4"
        />
      ),
    };
  }
  if (big(enteredAmount).eq(mockUpDepositAmount)) {
    return {
      variant: "honeydew",
      description:
        "The proposal will proceed to voting period immediately after created.",
      icon: (
        <CustomIcon
          name="info-circle-solid"
          color="honeydew.main"
          boxSize="4"
        />
      ),
    };
  }
  if (big(mockUpDepositAmount).lt(enteredAmount)) {
    return {
      variant: "warning",
      description: `You’re depositing more than the minimum requirement, the proposal will proceed to voting immediately after creation. To prevent fund loss if rejected, deposit equal to the minimum requirement.
`,
      icon: (
        <CustomIcon
          name="alert-circle-solid"
          color="warning.main"
          boxSize="4"
        />
      ),
    };
  }
  return {
    variant: "",
    description: "",
    icon: null,
  };
};
const Whitelisting = observer(() => {
  const { loading } = useSimulateFee();
  const router = useRouter();
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WhiteListState>({
    defaultValues: {
      title: "",
      description: "",
      addresses: [{ address: "" as Addr }],
      initialDeposit: { denom: "", amount: "" } as Coin,
      estimatedFee: undefined,
      simulateStatus: "pending",
      simulateError: "",
    },
  });
  const { title, addresses } = watch();
  const initialDepositWatch = watch("initialDeposit");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  const { address: walletAddress = "" } = useWallet();
  const { estimatedFee } = watch();
  const nativeTokensInfo = useNativeTokensInfo();
  const { variant, description, icon } = getAlert(initialDepositWatch.amount);
  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_PROPOSALS);
  }, [router.isReady]);

  return (
    <>
      <PageContainer>
        <Flex width="100%">
          <Grid templateColumns="1fr 6fr 4fr 1fr" gap={4} w="100%">
            <GridItem w="100%" />
            <GridItem w="100%">
              <Heading as="h5" variant="h5">
                Create Proposal to Whitelisting
              </Heading>
              <Text color="text.dark" pt={4}>
                Allowed address will be able to upload and stored code without
                opening proposal
              </Text>
              <ConnectWalletAlert
                subtitle="You need to connect wallet to proceed this action"
                mt={12}
              />
              <form style={{ width: "100%" }}>
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
                    placeholder="ex. Store code for ..."
                    label="Proposal Title"
                    labelBgColor="pebble.900"
                    variant="floating"
                    rules={{
                      required: "Proposal Title is required",
                      maxLength: MAX_PROPOSAL_TITLE_LENGTH,
                    }}
                    error={
                      errors.title &&
                      (errors.title.message ||
                        getMaxProposalTitleLengthError(title.length))
                    }
                  />
                  <ControllerTextarea
                    name="description"
                    control={control}
                    height="160px"
                    label="Proposal Description"
                    placeholder="Usually details information such as the team behind the contract, what the contract does, the benefits the contract will have to the chain/ecosystem, and the compiled code checksum or commit hash for the code on GitHub etc."
                    variant="floating"
                    labelBgColor="pebble.900"
                    rules={{
                      required: "Proposal Description is required",
                    }}
                    error={errors.description && errors.description.message}
                  />
                </Flex>
                <Heading as="h6" variant="h6" pt={12}>
                  Addresses to be allowed to store code
                </Heading>
                <Text color="text.dark" py={4}>
                  If the proposal is passed, these addresses will be allowed to
                  upload and store code without opening proposal
                </Text>
                {fields.map((field, idx) => (
                  <Flex gap={2} my={6} width="100%">
                    <AddressInput
                      name={`addresses.${idx}.address`}
                      control={control}
                      label="Address"
                      placeholder="ex.cltn1ff1asdf7988aw49efa4vw9846789"
                      variant="floating"
                      error={
                        addresses[idx].address &&
                        addresses.find(
                          (x, i) =>
                            i < idx && x.address === addresses[idx].address
                        ) &&
                        "You already input this address"
                      }
                      helperAction={
                        <AssignMe
                          onClick={
                            walletAddress &&
                            !addresses.find((x) => x.address === walletAddress)
                              ? () => {
                                  AmpTrack(AmpEvent.USE_ASSIGN_ME);
                                  setValue(
                                    `addresses.${idx}.address`,
                                    walletAddress as Addr
                                  );
                                }
                              : undefined
                          }
                          isDisable={
                            !!addresses.find((x) => x.address === walletAddress)
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
                  mx="auto"
                  onClick={() => append({ address: "" as Addr })}
                  leftIcon={<CustomIcon name="plus" color="violet.light" />}
                >
                  Add More Address
                </Button>
                <Heading as="h6" variant="h6" pt={12}>
                  Initial Deposit
                </Heading>
                <Text color="text.dark" pt={4}>
                  Minimum deposit required to start 7-day voting period:
                  1,000.000 KOYN
                </Text>
                <Flex py={6} gap={4}>
                  <Flex flex="1">
                    <SelectInput
                      formLabel="Asset"
                      options={nativeTokensInfo.map((asset) => ({
                        label: asset.symbol,
                        value: asset.base,
                        disabled: false,
                      }))}
                      onChange={(newVal) =>
                        setValue("initialDeposit.denom", newVal)
                      }
                      placeholder="Select"
                      initialSelected={initialDepositWatch.denom}
                    />
                  </Flex>
                  <Flex flex="3">
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
                          onClick={() =>
                            setValue(
                              "initialDeposit.amount",
                              big(mockUpDepositAmount).toFixed(2)
                            )
                          }
                        >
                          Fill {big(mockUpDepositAmount).toFixed(2)} KOYN
                        </Text>
                      }
                    />
                  </Flex>
                </Flex>
                <Alert variant={variant} gap="2" w="inherit">
                  {icon}
                  <AlertDescription>{description}</AlertDescription>
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
                    loading={loading}
                  />
                </Flex>
              </form>
            </GridItem>
            <GridItem w="100%">
              <StickySidebar
                marginTop="32"
                title=" What is whitelisted address?"
                description={
                  <span>
                    Osmosis Mainnet is permissioned chain, which means you will
                    need to submit proposal to store code <br />
                    <br />
                    However, there is a way to bypass this process by adding
                    your wallet address or other designated addresses to an
                    allow list.
                    <br />
                    <br />
                    Once your address is on this list, you will be able to store
                    code on the network without having to submit a proposal
                    every time.
                  </span>
                }
                testnetSwitch
                action
              />
            </GridItem>
            <GridItem w="100%" />
          </Grid>
        </Flex>
      </PageContainer>
      <Footer loading={false} />
    </>
  );
});

export default Whitelisting;
