import { Flex, Text } from "@chakra-ui/react";
import { TextReadOnly } from "lib/components/json/TextReadOnly";
import type { EvmVerifyError } from "lib/types";
import { jsonPrettify } from "lib/utils";
import { EvmVerifyAlert } from "./EvmVerifyAlert";

interface EvmVerifyFailedProps {
  evmVerifyError: EvmVerifyError;
}

export const EvmVerifyFailed = ({ evmVerifyError }: EvmVerifyFailedProps) => (
  <>
    <EvmVerifyAlert errorMsg={evmVerifyError.message} />
    {typeof evmVerifyError.details === "string" ? (
      <Flex direction="column" gap={2}>
        <Text variant="body2" color="text.dark">
          Compiler warning
        </Text>
        <TextReadOnly
          text={jsonPrettify(evmVerifyError.details)}
          canCopy
          showLines={10}
        />
      </Flex>
    ) : (
      <>
        <Flex direction="column" gap={2}>
          <Text variant="body2" color="text.dark">
            Expected bytecode
          </Text>
          <TextReadOnly
            text={evmVerifyError.details.requiredBytecode}
            canCopy
            showLines={4}
          />
        </Flex>
        <Flex direction="column" gap={2} mt={2}>
          <Text variant="body2" color="text.dark">
            Submitted bytecode
          </Text>
          <TextReadOnly
            text={jsonPrettify(
              JSON.stringify(evmVerifyError.details.compiledResults)
            )}
            canCopy
            showLines={10}
          />
        </Flex>
      </>
    )}
  </>
);
