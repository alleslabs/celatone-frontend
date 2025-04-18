import type { StdFee } from "@cosmjs/stargate";
import type { DecodeModuleQueryResponse } from "lib/services/types";
import type { Option } from "lib/types";
import type { Dispatch, SetStateAction } from "react";

import { Box, Button, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import {
  useCelatoneApp,
  useCurrentChain,
  useFabricateFee,
  useMoveConfig,
} from "lib/app-provider";
import { usePublishModuleTx } from "lib/app-provider/tx/publish";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { ErrorMessageRender } from "lib/components/ErrorMessageRender";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { CustomIcon } from "lib/components/icon";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { useTxBroadcast } from "lib/hooks";
import { useSimulateFeeQuery } from "lib/services/tx";
import { composePublishMsg } from "lib/utils";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import type { PublishCompleteState } from ".";
import type { PublishModuleState, PublishStatus } from "./formConstants";

import {
  Footer,
  PolicyAccordion,
  PolicyCard,
  UploadAccordion,
  UploadModuleCard,
} from "./components";
import { defaultValues, emptyModule, POLICIES } from "./formConstants";
import { statusResolver } from "./utils";

interface PublishModuleProps {
  setPublishTxInfo: Dispatch<SetStateAction<PublishCompleteState>>;
  setCompleted: Dispatch<SetStateAction<boolean>>;
}

export const PublishModule = ({
  setCompleted,
  setPublishTxInfo,
}: PublishModuleProps) => {
  // ------------------------------------------//
  // ---------------DEPENDENCIES---------------//
  // ------------------------------------------//
  const {
    chainConfig: { prettyName: chainPrettyName },
  } = useCelatoneApp();
  const router = useRouter();
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

  const { modules, upgradePolicy } = watch();

  const { append, move, remove, update } = useFieldArray({
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
          base64EncodedFile,
          decodeRes,
          file,
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
      address,
      modules.map((file) => file.base64EncodedFile),
      upgradePolicy
    ),
    onError: (e) => {
      setSimulateError(e.message);
      setEstimatedFee(undefined);
    },
    onSuccess: (gasRes) => {
      if (gasRes) {
        setEstimatedFee(fabricateFee(gasRes));
        setSimulateError("");
      } else setEstimatedFee(undefined);
    },
  });

  const proceed = useCallback(async () => {
    const stream = await postPublishTx({
      estimatedFee,
      messages: composePublishMsg(
        address,
        modules.map((file) => file.base64EncodedFile),
        upgradePolicy
      ),
      onTxFailed: () => setProcessing(false),
      onTxSucceed: (txResult) => {
        setPublishTxInfo({ ...txResult, modules, upgradePolicy });
        setProcessing(false);
        setCompleted(true);
      },
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
      modules.some(
        (field) =>
          !field.base64EncodedFile || field.publishStatus.status === "error"
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
          address,
          data: field.decodeRes,
          index,
          modules,
          policy: upgradePolicy,
        })
      );
    });
  }, [address, upgradePolicy, modules, setValue]);

  const publishModuleText = useMemo(
    () => ({
      connectWallet: "You need to connect wallet to proceed this action",
      description: `Upload .mv files to publish new module to ${chainPrettyName}. You can
      upload multiple .mv files to publish many modules within a
      transaction.`,
      header: "Publish / Republish modules",
    }),
    [chainPrettyName]
  );

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_PUBLISH_MODULE);
  }, [router.isReady]);

  return (
    <>
      <CelatoneSeo pageName="Publish / Republish modules" />
      <PageContainer p={0}>
        <Box maxW="1440px" minH="inherit" mx="auto">
          <Grid
            columnGap="16px"
            p={{ base: "16px", md: "48px" }}
            rowGap="48px"
            templateColumns="1fr 6fr 4fr 1fr"
          >
            <Box gridArea="1 / 2">
              <Heading as="h4" textAlign="center" variant="h4">
                {publishModuleText.header}
              </Heading>
              <Text color="text.dark" pt={4} textAlign="center">
                {publishModuleText.description}
              </Text>
              <ConnectWalletAlert
                mt={12}
                subtitle={publishModuleText.connectWallet}
              />
            </Box>
            {/* Upload File Section */}
            <Box gridArea="2 / 2">
              <Heading as="h6" variant="h6">
                Upload .mv file(s)
              </Heading>
              <Flex flexDirection="column" gap={6} my={6}>
                {modules.map((field, idx) => (
                  <UploadModuleCard
                    key={`${field.base64EncodedFile}-${idx.toString()}`}
                    fileState={field}
                    index={idx}
                    modules={modules}
                    moveEntry={move}
                    policy={upgradePolicy}
                    removeEntry={() => remove(idx)}
                    removeFile={() => {
                      update(idx, emptyModule);
                    }}
                    setFile={setFileValue(idx)}
                  />
                ))}
              </Flex>
              <Button
                leftIcon={<CustomIcon name="add-new" />}
                p="0 4px"
                variant="ghost-primary"
                onClick={() => {
                  track(AmpEvent.USE_ADD_MODULE_UPLOAD_BOX, {
                    currentBoxAmount: modules.length + 1,
                  });
                  append(emptyModule);
                }}
              >
                Publish more modules
              </Button>
            </Box>
            {/* Upgrade Policy Section */}
            <Box gridArea="3 / 2">
              <Heading as="h6" variant="h6">
                Upgrade policy
              </Heading>
              <Text color="text.dark" mt={2} variant="body2">
                Specify how publishing modules will be able to republish.
              </Text>
              <Flex direction="column" gap={2} my={4}>
                {POLICIES.map((item) => (
                  <PolicyCard
                    key={item.value}
                    description={item.description}
                    hasCondition={item.condition}
                    selected={upgradePolicy}
                    value={item.value}
                    onSelect={() => setValue("upgradePolicy", item.value)}
                  />
                ))}
              </Flex>
              <Text color="text.dark" variant="body3">
                ** Upgrade policy can be changed later, but will not able to
                change to the more lenient policy.
              </Text>
              <Flex
                alignItems="center"
                alignSelf="flex-start"
                color="text.dark"
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
                <ErrorMessageRender
                  alignSelf="flex-start"
                  error={simulateError}
                  mt={2}
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
        disabled={!enablePublish || Boolean(simulateError) || isSimulating}
        fieldAmount={modules.length}
        isLoading={processing}
        publishModule={() => {
          const republishModules = modules.filter((ampTrackRepublish) =>
            ampTrackRepublish.publishStatus.text.includes("republish")
          );
          track(AmpEvent.ACTION_MOVE_PUBLISH, {
            numberOfModule: modules.length,
            numberOfNewPublishModules: modules.length - republishModules.length,
            numberOfRepublishModules: republishModules.length,
          });
          proceed();
        }}
      />
    </>
  );
};
