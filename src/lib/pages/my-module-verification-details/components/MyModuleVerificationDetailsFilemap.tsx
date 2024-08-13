import { Heading, Stack } from "@chakra-ui/react";

import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { jsonPrettify } from "lib/utils";

export const MyModuleVerificationDetailsFilemap = () => (
  <Stack>
    <Heading as="h6" variant="h6">
      Filemap
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
