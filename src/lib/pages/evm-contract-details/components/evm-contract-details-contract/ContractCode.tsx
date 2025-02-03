import {
  Badge,
  Button,
  Flex,
  Heading,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { JsonFragment } from "ethers";
import { FullEditor } from "lib/components/editor/FullEditor";
import { TextReadOnly } from "lib/components/json/TextReadOnly";
import { EvmVerifyInfoSourceFile } from "lib/services/types";
import { findAndDecodeEvmConstructorArgs } from "lib/utils";

interface ContractCodeProps {
  sourceFiles: EvmVerifyInfoSourceFile[];
  contractPath: string;
  constructorArguments: string;
  abi: JsonFragment[];
}

export const ContractCode = ({
  sourceFiles,
  contractPath,
  constructorArguments,
  abi,
}: ContractCodeProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Stack gap={8}>
      <Stack gap={4}>
        <Flex justifyContent="space-between">
          <Flex gap={2} alignItems="center">
            <Heading as="h6" variant="h7">
              Contract source code
            </Heading>
            <Badge>{sourceFiles.length}</Badge>
          </Flex>
          <Button
            display={{
              base: "block",
              md: "none",
            }}
            onClick={onOpen}
            size="sm"
            variant="outline-primary"
          >
            Open file tree
          </Button>
        </Flex>
        <FullEditor
          filesPath={sourceFiles.map((file) => ({
            path: file.sourcePath,
            code: file.evmSourceFile.content,
          }))}
          initialFilePath={contractPath}
          isOpen={isOpen}
          onClose={onClose}
        />
      </Stack>
      <Stack gap={4}>
        <Heading as="h6" variant="h7">
          Constructor Arguments
        </Heading>
        <TextReadOnly
          text={findAndDecodeEvmConstructorArgs(abi, constructorArguments)}
          canCopy
        />
      </Stack>
    </Stack>
  );
};
