import {
  Flex,
  Heading,
  Text,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Button,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import type { Coin, StdFee } from "@cosmjs/stargate";
import { useWallet } from "@cosmos-kit/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { useNativeTokensInfo, useSimulateFee } from "lib/app-provider";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import {
  ControllerInput,
  ControllerTextarea,
  SelectInput,
} from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
import type { SimulateStatus } from "lib/components/upload/types";
import WasmPageContainer from "lib/components/WasmPageContainer";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { Addr } from "lib/types";

import { Footer } from "./components/Footer";
import { UploadFile } from "./components/UploadFile";

interface WhiteListState {
  title: string;
  description: string;
  creator: Addr;
  onlyAddress: string;
  addresses: { address: Addr }[];
  initialDeposit: Coin;
  estimatedFee?: StdFee;
  simulateStatus: SimulateStatus;
  simulateError: string;
}
const StoreCode = observer(() => {
  const { loading } = useSimulateFee();
  const router = useRouter();
  const { control, watch, setValue } = useForm<WhiteListState>({
    defaultValues: {
      title: "",
      description: "",
      creator: "",
      onlyAddress: "",
      addresses: [{ address: "" as Addr }],
      initialDeposit: { denom: "", amount: "" } as Coin,
      estimatedFee: undefined,
      simulateStatus: "pending",
      simulateError: "",
    },
  });
  const initialDepositWatch = watch("initialDeposit");
  const { address: walletAddress = "" } = useWallet();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  const { estimatedFee } = watch();
  const nativeTokensInfo = useNativeTokensInfo();
  const [permission, setpermission] = useState<
    "everybody" | "nobody" | "only-address" | "any-of-addresses"
  >("everybody");

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_PROPOSALS);
  }, [router.isReady]);

  return (
    <>
      <WasmPageContainer width="100%">
        <Flex gap={2}>
          <Box flex="1" />
          <Flex flex="10" position="relative">
            <Box flex="6">
              <Heading as="h5" variant="h5">
                Create Proposal to Store Code
              </Heading>
              <Text color="text.dark" pt={4}>
                To store your contract code, you need to submit a
                `StoreCodeProposal`. After the proposal passes, the code will be
                stored on-chain and can then be instantiated.
              </Text>
              <ConnectWalletAlert
                subtitle="You need to connect wallet to proceed this action"
                mt={12}
              />
              <form style={{ width: "100%" }}>
                <Flex mt={12} gap={6} flexDirection="column">
                  <Heading as="h6" variant="h6">
                    Create Proposal to Store Code
                  </Heading>
                  <ControllerInput
                    name="title"
                    control={control}
                    placeholder="ex. Store code for ..."
                    label="Proposal Title"
                    variant="floating"
                    rules={{ required: "title is required" }}
                  />
                  <ControllerTextarea
                    name="description"
                    control={control}
                    height="160px"
                    label="Proposal Description"
                    placeholder="Usually details information such as the team behind the contract, what the contract does, the benefits the contract will have to the chain/ecosystem, and the compiled code checksum or commit hash for the code on GitHub etc."
                    variant="floating"
                    rules={{ required: "Proposal Descriptio is required" }}
                  />
                  <ControllerInput
                    name="creator"
                    control={control}
                    placeholder="ex. cltn1ff1asdf7988aw49efa4vw9846789"
                    label="Run as"
                    variant="floating"
                    helperText="This address will be stored as code creator"
                    rules={{ required: "creator is required" }}
                  />
                </Flex>
                <UploadFile />
                <Heading as="h6" variant="h6" pt={12}>
                  Instantiate Permission
                </Heading>
                <Text color="text.dark" pt={4}>
                  If the proposal is passed, the stored code can be instantiated
                  to a contract by your selected option
                </Text>
                <Box pt={6}>
                  <RadioGroup
                    onChange={(
                      nextVal:
                        | "everybody"
                        | "nobody"
                        | "only-address"
                        | "any-of-addresses"
                    ) => {
                      setpermission(nextVal);
                    }}
                    value={permission}
                  >
                    <Box>
                      <Radio value="everybody" py={2} width="100%" size="lg">
                        <Text
                          fontWeight={
                            permission === "everybody" ? "600" : "400"
                          }
                        >
                          Anyone can instantiate (Everybody)
                        </Text>
                      </Radio>
                      <Radio value="nobody" py={2} width="100%" size="lg">
                        <Text
                          fontWeight={permission === "nobody" ? "600" : "400"}
                        >
                          Instantiate through governance only (Nobody)
                        </Text>
                      </Radio>
                      <Box>
                        <Radio
                          value="only-address"
                          py={2}
                          width="100%"
                          size="lg"
                        >
                          <Text
                            fontWeight={
                              permission === "only-address" ? "600" : "400"
                            }
                          >
                            Only a designated address only can instantiate
                            (OnlyAddress)
                          </Text>
                        </Radio>
                        {permission === "only-address" && (
                          <Box py={6}>
                            <ControllerInput
                              name="onlyAddress"
                              control={control}
                              placeholder="ex. cltn1ff1asdf7988aw49efa4vw9846789"
                              label="Designated Address"
                              variant="floating"
                              helperText="You can assign both wallet or contract address."
                              rules={{ required: "onlyAddress is required" }}
                              helperAction={
                                <Text
                                  color="honeydew.main"
                                  fontWeight="600"
                                  variant="body3"
                                  cursor="pointer"
                                  alignSelf="flex-start"
                                  onClick={() => {
                                    AmpTrack(AmpEvent.USE_ASSIGN_ME);
                                    setValue("onlyAddress", walletAddress);
                                  }}
                                >
                                  Assign me
                                </Text>
                              }
                            />
                          </Box>
                        )}
                      </Box>
                      <Box>
                        <Radio
                          value="any-of-addresses"
                          py={2}
                          width="100%"
                          size="lg"
                        >
                          <Text
                            fontWeight={
                              permission === "any-of-addresses" ? "600" : "400"
                            }
                          >
                            Only a set of addresses can instantiate
                            (AnyOfAddresses)
                          </Text>
                        </Radio>
                        {permission === "any-of-addresses" && (
                          <Box>
                            {fields.map((field, idx) => (
                              <Flex gap={2} my={6} width="100%">
                                <ControllerInput
                                  name={`addresses.${idx}.address`}
                                  control={control}
                                  label="Address"
                                  placeholder="ex. cltn1ff1asdf7988aw49efa4vw9846789"
                                  variant="floating"
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
                                    color={
                                      fields.length <= 1
                                        ? "pebble.600"
                                        : "text.dark"
                                    }
                                  />
                                </Button>
                              </Flex>
                            ))}
                            <Button
                              variant="outline-primary"
                              mt={3}
                              mx="auto"
                              onClick={() => append({ address: "" as Addr })}
                              leftIcon={
                                <CustomIcon name="plus" color="violet.light" />
                              }
                            >
                              Add More Address
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </RadioGroup>
                </Box>

                <Heading as="h6" variant="h6" pt={12}>
                  Initial Deposit
                </Heading>
                <Text color="text.dark" pt={4}>
                  Minimum deposit required to start 7-day voting period:
                  1,000.000 KOYN
                </Text>
                <Flex pt={6} gap={4}>
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
                    />
                  </Flex>
                </Flex>
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
            </Box>
            <Box flex="4" px={8} mt={40} position="relative">
              <Flex position="fixed" width="100%">
                <Accordion allowToggle width={96} defaultIndex={[0]}>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box as="span" flex="1" py={2} textAlign="left">
                          <Text
                            variant="body2"
                            fontWeight="600"
                            color="text.main"
                          >
                            Why do I need to submit proposal?
                          </Text>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Text variant="body2" color="text.dark" pb={4}>
                        Osmosis Mainnet is permissioned chain, which means you
                        will need to submit proposal to store code. <br />
                        <br /> Another way is to get your wallet address to
                        allow list to store code without opening proposal.{" "}
                        <br />
                        <br /> You still can upload your Wasm to see how your
                        code works on Testnet.
                      </Text>
                      <Button
                        size="md"
                        p="0"
                        variant="ghost-primary"
                        rightIcon={
                          <CustomIcon
                            name="chevron-right"
                            color="lilac.main"
                            boxSize={3}
                          />
                        }
                      >
                        Switch to testnet
                      </Button>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Flex>
            </Box>
          </Flex>
          <Box flex="1" />
        </Flex>
      </WasmPageContainer>
      <Footer
        loading={false}
        // onInstantiate={proceed}
        // disabled={disableInstantiate}
        // loading={simulating}
      />
    </>
  );
});

export default StoreCode;
