import type { Control } from "react-hook-form";

import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { jsonPrettify } from "lib/utils";
import { useMemo } from "react";
import { useWatch } from "react-hook-form";

import type { ModuleVerifyForm } from "../types";

import { generateFileMap } from "../helpers";

interface ModuleVerifyFileMapProps {
  control: Control<ModuleVerifyForm>;
}

export const ModuleVerifyFileMap = ({ control }: ModuleVerifyFileMapProps) => {
  const [moveFiles, tomlFile] = useWatch({
    control,
    name: ["moveFiles", "tomlFile"],
  });

  const fileMap: string = useMemo(
    () => generateFileMap(tomlFile, moveFiles),
    [tomlFile, moveFiles]
  );

  return (
    <Stack gap={4}>
      <Stack gap={2}>
        <Heading as="h6" variant="h6">
          Generated file map
        </Heading>
        <Text color="text.dark" variant="body2">
          You can refer to this file map to ensure that the uploaded files are
          in the correct structure.
        </Text>
      </Stack>
      {!tomlFile && !moveFiles.length ? (
        <Box bg="gray.900" p={8} rounded={8} textAlign="center">
          <Text color="text.dark" variant="body2">
            The generated file map from the uploaded folder will be displayed
            here.
          </Text>
        </Box>
      ) : (
        <JsonReadOnly canCopy fullWidth text={jsonPrettify(fileMap)} />
      )}
    </Stack>
  );
};
