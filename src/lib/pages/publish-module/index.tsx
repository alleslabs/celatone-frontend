import { Text, Grid, GridItem, Heading, Flex, Button } from "@chakra-ui/react";
import { useFieldArray, useForm } from "react-hook-form";

import { useCelatoneApp, useMoveConfig } from "lib/app-provider";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { CustomIcon } from "lib/components/icon";
import PageContainer from "lib/components/PageContainer";
import type { Option } from "lib/types";
import { UpgradePolicy } from "lib/types";

import {
  PolicyAccordion,
  UploadAccordion,
  Footer,
  PolicyCard,
  UploadModuleCard,
} from "./components";

interface Module {
  file: Option<File>;
  path: string;
}

interface PublishModuleState {
  modules: Module[];
  upgradePolicy: UpgradePolicy;
}

const emptyModule: Module = { file: undefined, path: "" };

const policies = [
  {
    value: UpgradePolicy.ARBITRARY,
    description: "You can publish these modules again without any restrictions",
    condition: false,
  },
  {
    value: UpgradePolicy.COMPATIBLE,
    description:
      "This address can publish these modules again but need to maintain several properties.",
    condition: true,
  },
  {
    value: UpgradePolicy.IMMUTABLE,
    description: "You cannot publish these modules again with this address",
    condition: false,
  },
];

const defaultValues: PublishModuleState = {
  modules: [emptyModule],
  upgradePolicy: UpgradePolicy.ARBITRARY,
};

export const PublishModule = () => {
  const {
    chainConfig: { prettyName: chainPrettyName },
  } = useCelatoneApp();
  useMoveConfig({ shouldRedirect: true });

  const PUBLISH_MODULE_TEXT = {
    header: "Publish new module",
    description: `Upload .mv files to publish new module to ${chainPrettyName}. You can
    upload multiple .mv files to publish many modules within a
    transaction.`,
    connectWallet: "You need to connect wallet to proceed this action",
  };

  const { control, setValue, watch } = useForm<PublishModuleState>({
    defaultValues,
  });

  const { upgradePolicy } = watch();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "modules",
  });

  return (
    <>
      <PageContainer>
        <Grid
          templateAreas={`
          "prespace header postspace"
          "prespace upload upload-accordion"
          "prespace policy policy-accordion"
          `}
          templateColumns="1fr 4fr 2fr"
          gap="48px"
        >
          <GridItem area="header">
            <Heading as="h5" variant="h5" textAlign="center">
              {PUBLISH_MODULE_TEXT.header}
            </Heading>
            <Text color="text.dark" pt={4} textAlign="center">
              {PUBLISH_MODULE_TEXT.description}
            </Text>
            <ConnectWalletAlert
              subtitle={PUBLISH_MODULE_TEXT.connectWallet}
              mt={12}
            />
          </GridItem>
          <GridItem area="upload">
            <Heading as="h6" variant="h6" fontWeight={600}>
              Upload .mv files(s)
            </Heading>
            <Flex gap={6} flexDirection="column" my={6}>
              {fields.map((field, idx) => (
                <UploadModuleCard
                  key={field.id}
                  index={idx}
                  fieldAmount={fields.length}
                  file={field.file}
                  setFile={(file: File, modulePath: string) => {
                    update(idx, { file, path: modulePath });
                  }}
                  removeFile={() => {
                    update(idx, emptyModule);
                  }}
                  removeEntry={() => remove(idx)}
                />
              ))}
            </Flex>
            <Button
              onClick={() => append(emptyModule)}
              leftIcon={<CustomIcon name="add-new" />}
              variant="ghost-primary"
              p="0 4px"
            >
              Publish More Modules
            </Button>
          </GridItem>
          <GridItem area="upload-accordion">
            <UploadAccordion />
          </GridItem>
          <GridItem area="policy">
            <Heading as="h6" variant="h6" fontWeight={600}>
              Upgrade Policy
            </Heading>
            <Text color="text.dark" variant="body2" mt={2}>
              Specify how publishing modules will be able to republish.
            </Text>
            <Flex direction="column" gap={2} my={4}>
              {policies.map((item) => (
                <PolicyCard
                  key={item.value}
                  value={item.value}
                  selected={upgradePolicy}
                  onSelect={() => setValue("upgradePolicy", item.value)}
                  description={item.description}
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
              <EstimatedFeeRender estimatedFee={undefined} loading={false} />
            </Flex>
          </GridItem>
          <GridItem area="policy-accordion">
            <PolicyAccordion chainName={chainPrettyName} />
          </GridItem>
        </Grid>
      </PageContainer>
      <Footer isLoading={false} fieldAmount={fields.length} />
    </>
  );
};
