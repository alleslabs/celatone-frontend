import { Heading, Stack } from "@chakra-ui/react";

import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { jsonPrettify } from "lib/utils";

export const MyModuleVerificationDetailsFileMap = () => (
  <Stack>
    <Heading as="h6" variant="h6">
      File Map
    </Heading>
    <JsonReadOnly
      text={jsonPrettify(
        JSON.stringify({
          "Move.toml": "Move.toml",
          "dex.move": "sources/dex.move",
        })
      )}
      canCopy
      fullWidth
    />
  </Stack>
);
