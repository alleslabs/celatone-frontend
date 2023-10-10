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
import { emptyModule, POLICIES, defaultValues } from "./formConstants";
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

  const { upgradePolicy, modules } = watch();

  const { append, remove, update, move } = useFieldArray({
    control,
    name: "modules",
  });

  const setFileValue = useCallback(
    (index: number) =>
      (
        file: Option<File>,
        base64EncodedFile: string,
        decodeRes: DecodeModuleQueryResponse,
        publishStatus: PublishStatus
      ) => {
        update(index, {
          file,
          base64EncodedFile,
          decodeRes,
          publishStatus,
        });
      },
    [update]
  );

  // ------------------------------------------//
  // ---------------TRANSACTION----------------//
  // ------------------------------------------//
  const enablePublish = useMemo(
    () =>
      Boolean(
        address &&
          modules.every(
            (field) =>
              field.base64EncodedFile && field.publishStatus.status !== "error"
          )
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [address, JSON.stringify(modules)]
  );

  const { isFetching: isSimulating } = useSimulateFeeQuery({
    enabled: enablePublish,
    messages: composePublishMsg(
      address as HumanAddr,
      modules.map((file) => file.base64EncodedFile),
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
        setPublishTxInfo({ ...txResult, upgradePolicy, modules });
        setProcessing(false);
        setCompleted(true);
      },
      onTxFailed: () => setProcessing(false),
      estimatedFee,
      messages: composePublishMsg(
        address as HumanAddr,
        modules.map((file) => file.base64EncodedFile),
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
    modules,
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
    if (
      !modules.every(
        (field) =>
          field.base64EncodedFile && field.publishStatus.status !== "error"
      )
    ) {
      setEstimatedFee(undefined);
    }
  }, [modules]);

  useEffect(() => {
    modules.forEach((field, index) => {
      setValue(
        `modules.${index}.publishStatus`,
        statusResolver({
          data: field.decodeRes,
          fields: modules,
          index,
          policy: upgradePolicy,
          address: address as Option<HumanAddr>,
        })
      );
    });
  }, [address, upgradePolicy, modules, setValue]);

  const publishModuleText = useMemo(
    () => ({
      header: "Publish new module",
      description: `Upload .mv files to publish new module to ${chainPrettyName}. You can
      upload multiple .mv files to publish many modules within a
      transaction.`,
      connectWallet: "You need to connect wallet to proceed this action",
    }),
    [chainPrettyName]
  );

  return (
    <>
      <PageContainer display="inline" p={0}>
        <Box minH="inherit" maxW="1440px" mx="auto">
          <Grid
            templateColumns="1fr 6fr 4fr 1fr"
            columnGap="16px"
            rowGap="48px"
            p={{ base: "16px", md: "48px" }}
          >
            <Box gridArea="1 / 2">
              <Heading as="h5" variant="h5" textAlign="center">
                {publishModuleText.header}
              </Heading>
              <Text color="text.dark" pt={4} textAlign="center">
                {publishModuleText.description}
              </Text>
              <ConnectWalletAlert
                subtitle={publishModuleText.connectWallet}
                mt={12}
              />
            </Box>
            {/* Upload File Section */}
            <Box gridArea="2 / 2">
              <Heading as="h6" variant="h6" fontWeight={600}>
                Upload .mv file(s)
              </Heading>
              <Flex gap={6} flexDirection="column" my={6}>
                {modules.map((field, idx) => (
                  <UploadModuleCard
                    key={`${field.base64EncodedFile}-${idx.toString()}`}
                    index={idx}
                    fields={modules}
                    fileState={field}
                    policy={upgradePolicy}
                    setFile={setFileValue(idx)}
                    removeFile={() => {
                      update(idx, emptyModule);
                    }}
                    removeEntry={() => remove(idx)}
                    moveEntry={move}
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
                {POLICIES.map((item) => (
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
        </Box>
      </PageContainer>
      <Footer
        publishModule={proceed}
        isLoading={processing}
        disabled={!enablePublish || Boolean(simulateError) || isSimulating}
        fieldAmount={modules.length}
      />
    </>
  );
};
