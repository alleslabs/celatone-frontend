import {
  Text,
  Grid,
  GridItem,
  Heading,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Flex,
  Button,
} from "@chakra-ui/react";
import { useFieldArray, useForm } from "react-hook-form";

import { useCelatoneApp } from "lib/app-provider";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { CustomIcon } from "lib/components/icon";

import { Footer } from "./components/Footer";
import { PolicyCard } from "./components/PolicyCard";
import { UploadModuleCard } from "./components/UploadModuleCard";

interface Module {
  file: string;
  path: string;
}
interface PublishModuleState {
  modules: { module: Module }[];
}

const policies = [
  {
    value: "arbitrary",
    description: "You can publish these modules again without any restrictions",
    condition: false,
  },
  {
    value: "compatible",
    description:
      "This address can publish these modules again but need to maintain several properties.",
    condition: true,
  },
  {
    value: "immutable",
    description: "You cannot publish these modules again with this address",
    condition: false,
  },
];

const defaultValues: PublishModuleState = {
  modules: [{ module: { file: "", path: "" } }],
};

export const PublishModule = () => {
  const {
    chainConfig: { prettyName: chainPrettyName },
  } = useCelatoneApp();

  const PUBLISH_MODULE_TEXT = {
    header: "Publish new module",
    description: `Upload .mv files to publish new module to ${chainPrettyName}. You can
    upload multiple .mv files to publish many modules within a
    transaction.`,
    connectWallet: "You need to connect wallet to proceed this action",
  };

  const { control } = useForm<PublishModuleState>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "modules",
  });

  return (
    <>
      <Box as="main" p={{ base: "16px", md: "48px" }} minH="inherit">
        <Grid
          templateAreas={`"prespace main postspace"`}
          templateColumns="1fr 5fr 4fr"
        >
          <GridItem area="main">
            <Heading as="h5" variant="h5">
              {PUBLISH_MODULE_TEXT.header}
            </Heading>
            <Text color="text.dark" pt={4}>
              {PUBLISH_MODULE_TEXT.description}
            </Text>
            <ConnectWalletAlert
              subtitle={PUBLISH_MODULE_TEXT.connectWallet}
              mt={12}
            />
          </GridItem>
        </Grid>
        <Flex position="relative" mt={12}>
          <Box w="10%" />
          <Box w="50%">
            <Heading as="h6" variant="h6" fontWeight={600}>
              Upload .mv files(s)
            </Heading>
            <Flex gap={6} flexDirection="column" my={6}>
              {fields.map((field, idx) => (
                <UploadModuleCard
                  index={idx}
                  fieldAmount={fields.length}
                  remove={() => remove(idx)}
                />
              ))}
            </Flex>
            <Button
              onClick={() => append({ module: { file: "", path: "" } })}
              leftIcon={<CustomIcon name="add-new" />}
              variant="ghost-primary"
              p="0 4px"
            >
              Publish More Modules
            </Button>
          </Box>
          <Box w="30%" position="relative" pl={12}>
            <Box position="sticky" top={0}>
              <Accordion
                position="relative"
                allowToggle
                width={96}
                defaultIndex={[0]}
                variant="transparent"
              >
                <AccordionItem borderTop="none" borderColor="gray.700">
                  <AccordionButton py={3} px={0}>
                    <Text
                      variant="body2"
                      fontWeight={700}
                      color="text.main"
                      textAlign="start"
                    >
                      What should I provide in my .mv files?
                    </Text>
                    <AccordionIcon color="gray.600" ml="auto" />
                  </AccordionButton>
                  <AccordionPanel
                    bg="transparent"
                    py={3}
                    px={0}
                    borderTop="1px solid"
                    borderColor="gray.700"
                  >
                    <Text variant="body2" color="text.dark" p={1}>
                      Your .mv files should consist of module name, available
                      functions and their properties, module mechanics, friends.
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Box>
          </Box>
          <Box w="10%" />
        </Flex>
        {/* Upgrade Policy */}
        <Flex position="relative" mt={12}>
          <Box w="10%" />
          <Box w="50%">
            <Heading as="h6" variant="h6" fontWeight={600}>
              Upgrade Policy
            </Heading>
            <Text color="text.dark" variant="body2" mt={2}>
              Specify how publishing modules will be able to republish.
            </Text>
            <Flex flexDirection="column" gap={2} my={4}>
              {policies.map((item) => (
                <PolicyCard
                  value={item.value}
                  description={item.description}
                  isLoading={false}
                  hasCondition={item.condition}
                />
              ))}
            </Flex>
            <Text color="text.dark" variant="body3">
              ** Upgrade policy can be changed later, but will not able to
              change to the more lenient policy.
            </Text>
            <Flex
              mt={12}
              fontSize="14px"
              color="text.dark"
              alignSelf="flex-start"
              alignItems="center"
              gap={1}
            >
              <p>Transaction Fee:</p>
              {/* <EstimatedFeeRender
              estimatedFee={estimatedFee}
              loading={isSimulating}
            /> */}
            </Flex>
          </Box>
          <Box w="30%" position="relative" pl={12}>
            <Box position="sticky" top={0}>
              <Accordion
                position="relative"
                allowToggle
                width={96}
                defaultIndex={[0]}
                variant="transparent"
              >
                <AccordionItem borderTop="none" borderColor="gray.700">
                  <AccordionButton py={3} px={0}>
                    <Text
                      variant="body2"
                      fontWeight={700}
                      color="text.main"
                      textAlign="start"
                    >
                      What is republishing module?
                    </Text>
                    <AccordionIcon color="gray.600" ml="auto" />
                  </AccordionButton>
                  <AccordionPanel
                    bg="transparent"
                    py={3}
                    px={0}
                    borderTop="1px solid"
                    borderColor="gray.700"
                  >
                    <Text variant="body2" color="text.dark" p={1}>
                      In {chainPrettyName}, You can republish the module which
                      serve the purpose to migrate or upgrade the published
                      module by uploading new .mv file with similar
                      configurations. Each policy will provide different
                      flexibility for further upgrades whether you can add new
                      functions without maintaining old functions (Arbitrary),
                      or required to maintain old functions (Compatible).
                      Choosing “Immutable” will not allow you to make any
                      changes with this module ever. You should read more about
                    </Text>
                    <Flex
                      align="center"
                      cursor="pointer"
                      borderRadius={4}
                      p={1}
                      gap={1}
                      alignItems="center"
                      width="fit-content"
                      transition="all 0.25s ease-in-out"
                      color="secondary.main"
                      _hover={{
                        color: "secondary.light",
                        bgColor: "secondary.background",
                      }}
                      // onClick={onClick}
                    >
                      <Text
                        variant="body3"
                        color="secondary.main"
                        fontWeight={700}
                      >
                        See Initia Doc
                      </Text>
                      <CustomIcon
                        name="chevron-right"
                        color="secondary.main"
                        boxSize={3}
                        m={0}
                      />
                    </Flex>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Box>
          </Box>
          <Box w="10%" />
        </Flex>
      </Box>
      <Footer isLoading={false} fieldAmount={fields.length} />
    </>
  );
};
