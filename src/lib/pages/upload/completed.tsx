import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import type { StoreCodeTxInternalResult } from "lib/app-fns/tx/storeCode";
import {
  useInternalNavigate,
  useTierConfig,
  useIsApiChain,
} from "lib/app-provider";
import ActionPageContainer from "lib/components/ActionPageContainer";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { UploadSchema } from "lib/components/json-schema";
import { WasmVerifySubmitModal } from "lib/components/modal";
import { Stepper } from "lib/components/stepper";
import { Tooltip } from "lib/components/Tooltip";
import { TxReceiptRender } from "lib/components/tx";
import {
  IndirectlyVerifiedAlert,
  InProgressVerifiedSection,
  OptionButton,
  OptionButtonDisabled,
} from "lib/components/upload";
import { WasmVerifyBadge } from "lib/components/WasmVerifyBadge";
import { useSchemaStore } from "lib/providers/store";
import { useDerivedWasmVerifyInfo } from "lib/services/verification/wasm";
import { WasmVerifyStatus } from "lib/types";
import { feeFromStr, getWasmVerifyStatus } from "lib/utils";

interface UploadCompleteProps {
  txResult: StoreCodeTxInternalResult;
}

export const UploadComplete = observer(({ txResult }: UploadCompleteProps) => {
  const { isFullTier } = useTierConfig();
  const isApiChain = useIsApiChain({
    shouldRedirect: false,
  });
  const navigate = useInternalNavigate();
  const { getSchemaByCodeHash } = useSchemaStore();
  const { data: derivedWasmVerifyInfo } = useDerivedWasmVerifyInfo(
    Number(txResult.codeId),
    txResult.codeHash
  );

  const wasmVerifyStatus = getWasmVerifyStatus(derivedWasmVerifyInfo);
  const localSchema = txResult.codeHash
    ? getSchemaByCodeHash(txResult.codeHash)
    : undefined;
  const attached = Boolean(localSchema);

  // NOTE: show OptionCards if not verifying or attached any local schema
  const displayOptions =
    wasmVerifyStatus !== WasmVerifyStatus.IN_PROGRESS && !attached;
  return (
    <ActionPageContainer>
      <Heading variant="h6" as="h6" color="text.dark" mb={3}>
        Deploy new contract
      </Heading>
      <Stepper mode="deploy" currentStep={1.5} />
      <CustomIcon
        name="check-circle-solid"
        color="success.main"
        boxSize={8}
        mt={10}
      />
      <Heading as="h4" variant="h4" mt={4} mb={12}>
        Upload Wasm File Complete!
      </Heading>
      <Text variant="body2" color="text.dark" fontWeight={500} mb={4}>
        ‘{txResult.codeDisplayName}’ has been uploaded.
      </Text>
      <Flex
        direction="column"
        border="1px solid"
        borderColor="gray.700"
        p={4}
        mb={4}
        w="full"
        borderRadius="4px"
      >
        <TxReceiptRender
          receipts={[
            {
              title: "Code ID",
              html: (
                <ExplorerLink
                  type="code_id"
                  value={txResult.codeId}
                  rightIcon={
                    <WasmVerifyBadge
                      status={wasmVerifyStatus}
                      relatedVerifiedCodes={
                        derivedWasmVerifyInfo?.relatedVerifiedCodes
                      }
                    />
                  }
                />
              ),
            },
            {
              title: "Tx Hash",
              html: <ExplorerLink type="tx_hash" value={txResult.txHash} />,
            },
            {
              title: "Tx Fee",
              html: (
                <EstimatedFeeRender
                  estimatedFee={feeFromStr(txResult.txFee)}
                  loading={false}
                />
              ),
            },
          ]}
          variant="full"
        />
      </Flex>
      {wasmVerifyStatus === WasmVerifyStatus.INDIRECTLY_VERIFIED && (
        <IndirectlyVerifiedAlert
          relatedVerifiedCodes={derivedWasmVerifyInfo?.relatedVerifiedCodes}
        />
      )}
      <Box h={12} />
      {displayOptions ? (
        <>
          <Heading as="h6" variant="h6" fontWeight={500} mb={2}>
            Would you like to:
          </Heading>
          <SimpleGrid columns={txResult.codeHash ? 2 : 1} spacing={4} w="full">
            <WasmVerifySubmitModal
              codeId={Number(txResult.codeId)}
              codeHash={txResult.codeHash}
              wasmVerifyStatus={getWasmVerifyStatus(derivedWasmVerifyInfo)}
              relatedVerifiedCodes={derivedWasmVerifyInfo?.relatedVerifiedCodes}
              disabled={!isApiChain}
              triggerElement={
                <Tooltip
                  label="Code verification is only available on official networks"
                  hidden={isApiChain}
                >
                  <OptionButton
                    title="Verify Code"
                    description="Ensures that the deployed code matches its published source code"
                    disabled={!isApiChain}
                  />
                </Tooltip>
              }
            />
            {txResult.codeHash && (
              <>
                {derivedWasmVerifyInfo?.schema ? (
                  <OptionButtonDisabled
                    title="Attach JSON Schema"
                    description="JSON Schema is already available due to the code is indirectly verified"
                  />
                ) : (
                  <UploadSchema
                    attached={attached}
                    localSchema={localSchema}
                    codeId={Number(txResult.codeId)}
                    codeHash={txResult.codeHash}
                    triggerElement={
                      <OptionButton
                        title="Attach JSON Schema"
                        description="Your attached JSON schema will be stored locally on your device"
                      />
                    }
                  />
                )}
              </>
            )}
          </SimpleGrid>
          <Flex my={8} gap={4} alignItems="center" w="full">
            <Divider borderColor="gray.600" />
            <Text variant="body1" color="text.dark">
              OR
            </Text>
            <Divider borderColor="gray.600" />
          </Flex>
        </>
      ) : (
        <>
          {wasmVerifyStatus === WasmVerifyStatus.IN_PROGRESS ? (
            <InProgressVerifiedSection codeId={txResult.codeId} />
          ) : (
            <>
              {txResult.codeHash !== undefined && localSchema && (
                <UploadSchema
                  attached={attached}
                  localSchema={localSchema}
                  codeId={Number(txResult.codeId)}
                  codeHash={txResult.codeHash}
                />
              )}
            </>
          )}
          <Box h={12} />
        </>
      )}
      <Button
        rightIcon={<CustomIcon name="chevron-right" boxSize={4} />}
        w="full"
        mb={4}
        onClick={() => {
          navigate({
            pathname: "/instantiate",
            query: { codeId: txResult.codeId },
          });
        }}
      >
        {displayOptions
          ? "Skip and proceed to instantiate"
          : "Proceed to instantiate"}
      </Button>
      {isFullTier && (
        <Button
          variant="outline-primary"
          w="full"
          onClick={() => {
            navigate({ pathname: "/stored-codes" });
          }}
        >
          Go to my stored codes
        </Button>
      )}
    </ActionPageContainer>
  );
});
