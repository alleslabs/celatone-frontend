import type { JsonFragment } from "ethers";
import type {
  EvmVerifyInfoLibraries,
  EvmVerifyInfoSourceFile,
} from "lib/types";

import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FullEditor } from "lib/components/editor/FullEditor";
import { TextReadOnly } from "lib/components/json/TextReadOnly";
import { findAndDecodeEvmConstructorArgs } from "lib/utils";

import { ContractLibraryList } from "./ContractLibraryList";

interface ContractCodeProps {
  abi: JsonFragment[];
  constructorArguments: string;
  contractPath: string;
  libraries: EvmVerifyInfoLibraries;
  sourceFiles: EvmVerifyInfoSourceFile[];
}

export const ContractCode = ({
  abi,
  constructorArguments,
  contractPath,
  libraries,
  sourceFiles,
}: ContractCodeProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const foundConstructorArgs = findAndDecodeEvmConstructorArgs(
    abi,
    constructorArguments
  );

  return (
    <Stack gap={8}>
      <Stack gap={4}>
        <Flex justifyContent="space-between">
          <Flex alignItems="center" gap={2}>
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
            size="sm"
            variant="outline-primary"
            onClick={onOpen}
          >
            Open file tree
          </Button>
        </Flex>
        <FullEditor
          filesPath={sourceFiles.map((file) => ({
            code: file.evmSourceFile.content,
            path: file.sourcePath,
          }))}
          initialFilePath={contractPath}
          isOpen={isOpen}
          libraryFilesPath={libraries.map((lib) => lib.contractPath)}
          onClose={onClose}
        />
      </Stack>
      {libraries.length > 0 && (
        <Stack gap={4}>
          <Flex alignItems="center" gap={2}>
            <Heading as="h6" variant="h7">
              Contract Library
            </Heading>
            <Badge>{libraries.length}</Badge>
          </Flex>
          <ContractLibraryList libraries={libraries} />
        </Stack>
      )}
      <Stack gap={4}>
        <Heading as="h6" variant="h7">
          Constructor Arguments
        </Heading>
        {foundConstructorArgs ? (
          <TextReadOnly canCopy text={foundConstructorArgs} />
        ) : (
          <Box>
            <Text bg="gray.900" color="text.disabled" px={3} py={4} rounded={8}>
              No constructor arguments
            </Text>
          </Box>
        )}
      </Stack>
    </Stack>
  );
};
