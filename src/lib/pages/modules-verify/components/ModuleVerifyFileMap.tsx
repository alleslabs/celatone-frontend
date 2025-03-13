import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { useWatch } from "react-hook-form";
import type { Control } from "react-hook-form";

import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { jsonPrettify } from "lib/utils";
import { generateFileMap } from "../helpers";
import type { ModuleVerifyForm } from "../types";

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
          Generated File Map
        </Heading>
        <Text variant="body2" color="text.dark">
          You can refer to this file map to ensure that the uploaded files are
          in the correct structure.
        </Text>
      </Stack>
      {!tomlFile && !moveFiles.length ? (
        <Box p={8} textAlign="center" bg="gray.900" rounded={8}>
          <Text variant="body2" color="text.dark">
            The generated file map from the uploaded folder will be displayed
            here.
          </Text>
        </Box>
      ) : (
        <JsonReadOnly text={jsonPrettify(fileMap)} canCopy fullWidth />
      )}
    </Stack>
  );
};
