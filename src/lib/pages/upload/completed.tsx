import { Box, Button, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import type { UploadTxInternalResult } from "lib/app-provider";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { Stepper } from "lib/components/stepper";
import { TxReceiptRender } from "lib/components/tx";
import WasmPageContainer from "lib/components/WasmPageContainer";

import { UploadSchema } from "./components/UploadSchema";

interface UploadCompleteProps {
  txResult: UploadTxInternalResult;
}

export const UploadComplete = observer(({ txResult }: UploadCompleteProps) => {
  const navigate = useInternalNavigate();
  // Retrieve schema from local storage
  const schema = {
    wow: "asdasdsad",
    wowza: "xzkcnzxlkczxnc",
    instantiate: "sadkasdkamdaskldks",
  };
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
              value: txResult.formattedFee,
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

      <UploadSchema
        attached={attached}
        schema={schema}
        codeId={txResult.codeId}
      />

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
        rightIcon={
          <CustomIcon name="chevron-right" boxSize={4} color="text.dark" />
        }
        w="full"
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
          navigate({ pathname: "/my-codes" });
        }}
      >
        Go to my code list
      </Button>
    </WasmPageContainer>
  );
});
