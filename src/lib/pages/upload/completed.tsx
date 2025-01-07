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
import { useInternalNavigate } from "lib/app-provider";
import ActionPageContainer from "lib/components/ActionPageContainer";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { UploadSchema } from "lib/components/json-schema";
import { WasmVerifySubmitModal } from "lib/components/modal";
import { Stepper } from "lib/components/stepper";
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
      <Heading as="h6" mb={3} variant="h6" color="text.dark">
        Deploy new contract
      </Heading>
      <Stepper currentStep={1.5} mode="deploy" />
      <CustomIcon
        mt={10}
        name="check-circle-solid"
        boxSize={8}
        color="success.main"
      />
      <Heading as="h4" mb={12} mt={4} variant="h4">
        Upload Wasm File Complete!
      </Heading>
      <Text mb={4} variant="body2" color="text.dark" fontWeight={500}>
        ‘{txResult.codeDisplayName}’ has been uploaded.
      </Text>
      <Flex
        mb={4}
        p={4}
        w="full"
        border="1px solid"
        borderColor="gray.700"
        borderRadius="4px"
        direction="column"
      >
        <TxReceiptRender
          receipts={[
            {
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
              title: "Code ID",
            },
            {
              html: <ExplorerLink type="tx_hash" value={txResult.txHash} />,
              title: "Tx Hash",
            },
            {
              html: (
                <EstimatedFeeRender
                  estimatedFee={feeFromStr(txResult.txFee)}
                  loading={false}
                />
              ),
              title: "Tx Fee",
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
          <Heading as="h6" mb={2} variant="h6" fontWeight={500}>
            Would you like to:
          </Heading>
          <SimpleGrid spacing={4} w="full" columns={txResult.codeHash ? 2 : 1}>
            <WasmVerifySubmitModal
              triggerElement={
                <OptionButton
                  title="Verify Code"
                  description="Ensures that the deployed code matches its published source code"
                />
              }
              wasmVerifyStatus={getWasmVerifyStatus(derivedWasmVerifyInfo)}
              codeHash={txResult.codeHash}
              codeId={Number(txResult.codeId)}
              relatedVerifiedCodes={derivedWasmVerifyInfo?.relatedVerifiedCodes}
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
                    triggerElement={
                      <OptionButton
                        title="Attach JSON Schema"
                        description="Your attached JSON schema will be stored locally on your device"
                      />
                    }
                    codeHash={txResult.codeHash}
                    codeId={Number(txResult.codeId)}
                    localSchema={localSchema}
                  />
                )}
              </>
            )}
          </SimpleGrid>
          <Flex alignItems="center" gap={4} my={8} w="full">
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
        w="full"
        onClick={() => {
          navigate({
            pathname: "/instantiate",
            query: { codeId: txResult.codeId },
          });
        }}
        rightIcon={<CustomIcon name="chevron-right" boxSize={4} />}
      >
        {displayOptions
          ? "Skip and proceed to instantiate"
          : "Proceed to instantiate"}
      </Button>
      <Button
        variant="outline-primary"
        w="full"
        onClick={() => {
          navigate({ pathname: "/stored-codes" });
        }}
      >
        Go to my stored codes
      </Button>
    </ActionPageContainer>
  );
});
