import type { EvmVerifyError } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { TextReadOnly } from "lib/components/json/TextReadOnly";
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
        <Text color="text.dark" variant="body2">
          Compiler warning
        </Text>
        <TextReadOnly
          canCopy
          showLines={10}
          text={jsonPrettify(evmVerifyError.details)}
        />
      </Flex>
    ) : (
      <>
        <Flex direction="column" gap={2}>
          <Text color="text.dark" variant="body2">
            Expected bytecode
          </Text>
          <TextReadOnly
            canCopy
            showLines={4}
            text={evmVerifyError.details.requiredBytecode}
          />
        </Flex>
        <Flex direction="column" gap={2} mt={2}>
          <Text color="text.dark" variant="body2">
            Submitted bytecode
          </Text>
          <TextReadOnly
            canCopy
            showLines={10}
            text={jsonPrettify(
              JSON.stringify(evmVerifyError.details.compiledResults)
            )}
          />
        </Flex>
      </>
    )}
  </>
);
