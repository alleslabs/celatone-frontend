import type { StoreCodeTxInternalResult } from "lib/app-fns/tx/storeCode";

import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import {
  useInternalNavigate,
  useIsApiChain,
  useTierConfig,
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
import { observer } from "mobx-react-lite";

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
      <Heading as="h6" color="text.dark" mb={3} variant="h6">
        Deploy new contract
      </Heading>
      <Stepper currentStep={1.5} mode="deploy" />
      <CustomIcon
        boxSize={8}
        color="success.main"
        mt={10}
        name="check-circle-solid"
      />
      <Heading as="h4" mb={12} mt={4} variant="h4">
        Upload Wasm file complete!
      </Heading>
      <Text color="text.dark" fontWeight={500} mb={4} variant="body2">
        ‘{txResult.codeDisplayName}’ has been uploaded.
      </Text>
      <Flex
        border="1px solid"
        borderColor="gray.700"
        borderRadius="4px"
        direction="column"
        mb={4}
        p={4}
        w="full"
      >
        <TxReceiptRender
          receipts={[
            {
              html: (
                <ExplorerLink
                  rightIcon={
                    <WasmVerifyBadge
                      relatedVerifiedCodes={
                        derivedWasmVerifyInfo?.relatedVerifiedCodes
                      }
                      status={wasmVerifyStatus}
                    />
                  }
                  type="code_id"
                  value={txResult.codeId}
                />
              ),
              title: "Code ID",
            },
            {
              html: <ExplorerLink type="tx_hash" value={txResult.txHash} />,
              title: "Tx hash",
            },
            {
              html: (
                <EstimatedFeeRender
                  estimatedFee={feeFromStr(txResult.txFee)}
                  loading={false}
                />
              ),
              title: "Tx fee",
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
          <Heading as="h6" fontWeight={500} mb={2} variant="h6">
            Would you like to:
          </Heading>
          <SimpleGrid columns={txResult.codeHash ? 2 : 1} spacing={4} w="full">
            <WasmVerifySubmitModal
              codeHash={txResult.codeHash}
              codeId={Number(txResult.codeId)}
              disabled={!isApiChain}
              relatedVerifiedCodes={derivedWasmVerifyInfo?.relatedVerifiedCodes}
              triggerElement={
                <Tooltip
                  hidden={isApiChain}
                  label="Code verification is only available on official networks"
                >
                  <OptionButton
                    description="Ensures that the deployed code matches its published source code"
                    disabled={!isApiChain}
                    title="Verify code"
                  />
                </Tooltip>
              }
              wasmVerifyStatus={getWasmVerifyStatus(derivedWasmVerifyInfo)}
            />
            {txResult.codeHash && (
              <>
                {derivedWasmVerifyInfo?.schema ? (
                  <OptionButtonDisabled
                    description="JSON schema is already available due to the code is indirectly verified"
                    title="Attach JSON schema"
                  />
                ) : (
                  <UploadSchema
                    attached={attached}
                    codeHash={txResult.codeHash}
                    codeId={Number(txResult.codeId)}
                    localSchema={localSchema}
                    triggerElement={
                      <OptionButton
                        description="Your attached JSON schema will be stored locally on your device"
                        title="Attach JSON schema"
                      />
                    }
                  />
                )}
              </>
            )}
          </SimpleGrid>
          <Flex alignItems="center" gap={4} my={8} w="full">
            <Divider borderColor="gray.600" />
            <Text color="text.dark" variant="body1">
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
                  codeHash={txResult.codeHash}
                  codeId={Number(txResult.codeId)}
                  localSchema={localSchema}
                />
              )}
            </>
          )}
          <Box h={12} />
        </>
      )}
      <Button
        mb={4}
        rightIcon={<CustomIcon boxSize={4} name="chevron-right" />}
        w="full"
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
