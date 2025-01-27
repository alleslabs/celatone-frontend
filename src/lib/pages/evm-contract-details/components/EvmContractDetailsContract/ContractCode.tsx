import { Badge, Flex, Heading, Stack } from "@chakra-ui/react";
import { FullEditor } from "lib/components/editor/FullEditor";
import { EvmVerifyInfoSourceFile } from "lib/services/types";

interface ContractCodeProps {
  sourceFiles: EvmVerifyInfoSourceFile[];
  contractPath: string;
}

export const ContractCode = ({
  sourceFiles,
  contractPath,
}: ContractCodeProps) => (
  <Stack gap={8}>
    <Stack gap={4}>
      <Flex gap={2} alignItems="center">
        <Heading as="h6" variant="h7">
          Contract source code
        </Heading>
        <Badge>{sourceFiles.length}</Badge>
      </Flex>
      <FullEditor
        filesPath={sourceFiles.map((file) => ({
          path: file.sourcePath,
          code: file.evmSourceFile.content,
        }))}
        initialFilePath={contractPath}
      />
    </Stack>
    {/* <Stack gap={4}>
      <Heading as="h6" variant="h7">
        Constructor Arguments
      </Heading>
    </Stack> */}
  </Stack>
);
