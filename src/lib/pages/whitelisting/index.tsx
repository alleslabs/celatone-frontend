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
} from "@chakra-ui/react";
import type { Coin, StdFee } from "@cosmjs/stargate";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";
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
import PageContainer from "lib/components/PageContainer";
import type { SimulateStatus } from "lib/components/upload/types";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { Addr } from "lib/types";

interface WhiteListState {
  title: string;
  description: string;
  addresses: { address: Addr }[];
  initialDeposit: Coin;
  estimatedFee?: StdFee;
  simulateStatus: SimulateStatus;
  simulateError: string;
}
const Whitelisting = observer(() => {
  const { loading } = useSimulateFee();
  const router = useRouter();
  const { control, watch, setValue } = useForm<WhiteListState>({
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
  const initialDepositWatch = watch("initialDeposit");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  const { estimatedFee } = watch();
  const nativeTokensInfo = useNativeTokensInfo();

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_PROPOSALS);
  }, [router.isReady]);

  return (
    <PageContainer>
      <Flex gap={2}>
        <Box flex="1" />
        <Flex flex="10" position="relative">
          <Box flex="6">
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
                  variant="floating"
                  rules={{ required: "Label is required" }}
                  labelBgColor="pebble.900"
                />
                <ControllerTextarea
                  name="description"
                  control={control}
                  height="160px"
                  label="Proposal Description"
                  placeholder="Usually details information such as the team behind the contract, what the contract does, the benefits the contract will have to the chain/ecosystem, and the compiled code checksum or commit hash for the code on GitHub etc."
                  variant="floating"
                  // rules={{
                  //   maxLength: MAX_CONTRACT_DESCRIPTION_LENGTH,
                  // }}
                  labelBgColor="pebble.900"
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
                <Flex gap={2} my={6}>
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
                Minimum deposit required to start 7-day voting period: 1,000.000
                KOYN
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
          <Box flex="4" px={8} mt={36} position="relative">
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
                          What is whitelisted address?
                        </Text>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text variant="body2" color="text.dark" pb={4}>
                      Osmosis Mainnet is permissioned chain, which means you
                      will need to submit proposal to store code <br />
                      <br />
                      However, there is a way to bypass this process by adding
                      your wallet address or other designated addresses to an
                      allow list.
                      <br />
                      <br />
                      Once your address is on this list, you will be able to
                      store code on the network without having to submit a
                      proposal every time.
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
                      Submit proposal to store code
                    </Button>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Flex>
          </Box>
        </Flex>
        <Box flex="1" />
      </Flex>
    </PageContainer>
  );
});

export default Whitelisting;
