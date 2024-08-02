import { Box, Button, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import type { StoreCodeTxInternalResult } from "lib/app-fns/tx/storeCode";
import { useInternalNavigate } from "lib/app-provider";
import { ConnectingLine } from "lib/components/ConnectingLine";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { UploadSchema } from "lib/components/json-schema";
import { WasmVerifySubmitModal } from "lib/components/modal";
import { Stepper } from "lib/components/stepper";
import { TxReceiptRender } from "lib/components/tx";
import WasmPageContainer from "lib/components/WasmPageContainer";
import { useSchemaStore } from "lib/providers/store";
import { useGetWasmVerifyInfos } from "lib/services/verification/wasm";
import { feeFromStr, getWasmVerifyStatus } from "lib/utils";

interface UploadCompleteProps {
  txResult: StoreCodeTxInternalResult;
}

export const UploadComplete = observer(({ txResult }: UploadCompleteProps) => {
  const navigate = useInternalNavigate();
  const { getSchemaByCodeHash } = useSchemaStore();
  const { data: wasmVerifyInfos } = useGetWasmVerifyInfos([
    Number(txResult.codeId),
  ]);

  const wasmVerifyInfo = wasmVerifyInfos?.[Number(txResult.codeId)];
  const schema = getSchemaByCodeHash(txResult.codeHash);
  const attached = Boolean(schema);

  return (
    <WasmPageContainer>
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
      <Box
        border="1px solid"
        borderColor="gray.700"
        p={4}
        mb={12}
        w="full"
        borderRadius="4px"
      >
        <TxReceiptRender
          receipts={[
            {
              title: "Code ID",
              html: <ExplorerLink type="code_id" value={txResult.codeId} />,
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
      </Box>
      <Heading as="h6" variant="h6" fontWeight={500} mb={2}>
        Would you like to attach JSON Schema to this code?
      </Heading>
      <Text color="text.disabled" variant="body2" fontWeight={500} mb={4}>
        Your attached JSON schema will be stored locally on your device
      </Text>
      <Flex direction="column" w="full" gap={10} position="relative">
        <Flex
          bgColor="gray.800"
          borderRadius={4}
          p={2}
          gap={2}
          w="full"
          justifyContent="center"
        >
          <CustomIcon name="code" color="gray.400" />
          Code ID: {txResult.codeId}
        </Flex>
        <ConnectingLine
          isFilled={attached}
          style={{ left: "calc(50% - 6px)", top: "36px" }}
        />
        <UploadSchema
          attached={attached}
          schema={schema}
          codeId={Number(txResult.codeId)}
          codeHash={txResult.codeHash}
        />
      </Flex>
      <Flex mt={10}>
        <WasmVerifySubmitModal
          codeId={Number(txResult.codeId)}
          codeHash={txResult.codeHash}
          wasmVerifyStatus={getWasmVerifyStatus(wasmVerifyInfo)}
          relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
          triggerElement={<Button>Verfiy Code</Button>}
        />
      </Flex>
      {!attached && (
        <Flex my={8} gap={4} alignItems="center" w="full">
          <Divider borderColor="gray.600" />
          <Text variant="body1" color="text.dark">
            OR
          </Text>
          <Divider borderColor="gray.600" />
        </Flex>
      )}
      <Button
        rightIcon={<CustomIcon name="chevron-right" boxSize={4} />}
        w="full"
        mt={attached ? 8 : 0}
        mb={4}
        onClick={() => {
          navigate({
            pathname: "/instantiate",
            query: { "code-id": txResult.codeId },
          });
        }}
      >
        {attached
          ? "Proceed to instantiate"
          : "Skip and proceed to instantiate"}
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
    </WasmPageContainer>
  );
});
