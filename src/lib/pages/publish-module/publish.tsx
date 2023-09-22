import { Text, Grid, Heading, Flex, Button, Box } from "@chakra-ui/react";
import type { StdFee } from "@cosmjs/stargate";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import {
  useCelatoneApp,
  useCurrentChain,
  useFabricateFee,
  useMoveConfig,
  useSimulateFeeQuery,
} from "lib/app-provider";
import { usePublishModuleTx } from "lib/app-provider/tx/publish";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { ErrorMessageRender } from "lib/components/ErrorMessageRender";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { CustomIcon } from "lib/components/icon";
import PageContainer from "lib/components/PageContainer";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import type { DecodeModuleQueryResponse } from "lib/services/moduleService";
import type { HumanAddr, Option } from "lib/types";
import { composePublishMsg } from "lib/utils";

import type { PublishCompleteState } from ".";
import {
  PolicyAccordion,
  UploadAccordion,
  Footer,
  PolicyCard,
  UploadModuleCard,
} from "./components";
import type { PublishModuleState, PublishStatus } from "./formConstants";
import { emptyModule, policies, defaultValues } from "./formConstants";
import { statusResolver } from "./utils";

interface PublishModuleProps {
  setPublishTxInfo: Dispatch<SetStateAction<PublishCompleteState>>;
  setCompleted: Dispatch<SetStateAction<boolean>>;
}

export const PublishModule = ({
  setPublishTxInfo,
  setCompleted,
}: PublishModuleProps) => {
  // ------------------------------------------//
  // ---------------DEPENDENCIES---------------//
  // ------------------------------------------//
  const {
    chainConfig: { prettyName: chainPrettyName },
  } = useCelatoneApp();
  const { address } = useCurrentChain();
  const fabricateFee = useFabricateFee();
  const postPublishTx = usePublishModuleTx();
  const { broadcast } = useTxBroadcast();
  useMoveConfig({ shouldRedirect: true });

  // ------------------------------------------//
  // ------------------STATES------------------//
  // ------------------------------------------//
  const [estimatedFee, setEstimatedFee] = useState<StdFee>();
  const [simulateError, setSimulateError] = useState("");
  const [processing, setProcessing] = useState(false);

  // ------------------------------------------//
  // ----------------FORM HOOKS----------------//
  // ------------------------------------------//
  const { control, setValue, watch } = useForm<PublishModuleState>({
    defaultValues,
  });

  const { upgradePolicy } = watch();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "modules",
  });

  // ------------------------------------------//
  // ---------------TRANSACTION----------------//
  // ------------------------------------------//
  const enablePublish = useMemo(
    () =>
      Boolean(
        address &&
          fields.every(
            (field) =>
              field.base64File && field.publishStatus.status !== "error"
          )
      ),
    [address, fields]
  );

  const { isFetching: isSimulating } = useSimulateFeeQuery({
    enabled: enablePublish,
    messages: composePublishMsg(
      address as HumanAddr,
      fields.map((file) => file.base64File),
      upgradePolicy
    ),
    onSuccess: (gasRes) => {
      if (gasRes) {
        setEstimatedFee(fabricateFee(gasRes));
        setSimulateError("");
      } else setEstimatedFee(undefined);
    },
    onError: (e) => {
      setSimulateError(e.message);
      setEstimatedFee(undefined);
    },
  });

  const proceed = useCallback(async () => {
    const stream = await postPublishTx({
      onTxSucceed: (txResult) => {
        setPublishTxInfo({ ...txResult, upgradePolicy, modules: fields });
        setProcessing(false);
        setCompleted(true);
      },
      onTxFailed: () => setProcessing(false),
      estimatedFee,
      messages: composePublishMsg(
        address as HumanAddr,
        fields.map((file) => file.base64File),
        upgradePolicy
      ),
    });
    if (stream) {
      setProcessing(true);
      broadcast(stream);
    }
  }, [
    address,
    estimatedFee,
    fields,
    upgradePolicy,
    broadcast,
    postPublishTx,
    setCompleted,
    setPublishTxInfo,
  ]);

  // ------------------------------------------//
  // ---------------SIDE EFFECTS---------------//
  // ------------------------------------------//
  useEffect(() => {
    if (!fields.every((field) => field.base64File)) {
      setEstimatedFee(undefined);
    }
  }, [fields]);

  const PUBLISH_MODULE_TEXT = {
    header: "Publish new module",
    description: `Upload .mv files to publish new module to ${chainPrettyName}. You can
    upload multiple .mv files to publish many modules within a
    transaction.`,
    connectWallet: "You need to connect wallet to proceed this action",
  };
  return (
    <>
      <PageContainer display="unset" p={0}>
        <Grid
          templateColumns="1fr 6fr 4fr 1fr"
          columnGap="16px"
          rowGap="48px"
          p={{ base: "16px", md: "48px" }}
        >
          <Box gridArea="1 / 2">
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
          </Box>
          {/* Upload File Section */}
          <Box gridArea="2 / 2">
            <Heading as="h6" variant="h6" fontWeight={600}>
              Upload .mv file(s)
            </Heading>
            <Flex gap={6} flexDirection="column" my={6}>
              {fields.map((field, idx) => (
                <UploadModuleCard
                  key={field.id}
                  index={idx}
                  fields={fields}
                  fileState={field}
                  policy={upgradePolicy}
                  setFile={(
                    file: Option<File>,
                    base64File: string,
                    decodeRes: DecodeModuleQueryResponse,
                    publishStatus: PublishStatus
                  ) => {
                    update(idx, {
                      file,
                      base64File,
                      decodeRes,
                      publishStatus,
                    });
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
          </Box>
          {/* Upgrade Policy Section */}
          <Box gridArea="3 / 2">
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
                  onSelect={() => {
                    setValue("upgradePolicy", item.value);
                    fields.forEach((field, index) =>
                      update(index, {
                        ...field,
                        publishStatus: statusResolver({
                          data: field.decodeRes,
                          fields,
                          index,
                          policy: item.value,
                        }),
                      })
                    );
                  }}
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
              <EstimatedFeeRender
                estimatedFee={estimatedFee}
                loading={isSimulating}
              />
            </Flex>
            {simulateError && (
              <ErrorMessageRender
                error={simulateError}
                mt={2}
                alignSelf="flex-start"
              />
            )}
          </Box>
          <Box gridArea="2 / 3" pl="32px">
            <UploadAccordion />
          </Box>
          <Box gridArea="3 / 3" pl="32px">
            <PolicyAccordion chainName={chainPrettyName} />
          </Box>
        </Grid>
      </PageContainer>
      <Footer
        publishModule={proceed}
        isLoading={processing}
        disabled={!enablePublish || Boolean(simulateError) || isSimulating}
        fieldAmount={fields.length}
      />
    </>
  );
};
