import { Heading, Stack } from "@chakra-ui/react";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { jsonPrettify } from "lib/utils";

interface MyModuleVerificationDetailsFileMapProps {
  fileMap: Record<string, string>;
}

export const MyModuleVerificationDetailsFileMap = ({
  fileMap,
}: MyModuleVerificationDetailsFileMapProps) => (
  <Stack>
    <Heading as="h6" variant="h6">
      File Map
    </Heading>
    <JsonReadOnly
      canCopy
      fullWidth
      text={jsonPrettify(JSON.stringify(fileMap))}
    />
  </Stack>
);
