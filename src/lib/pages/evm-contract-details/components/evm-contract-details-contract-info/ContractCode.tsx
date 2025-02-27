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
import type { JsonFragment } from "ethers";
import { FullEditor } from "lib/components/editor/FullEditor";
import { TextReadOnly } from "lib/components/json/TextReadOnly";
import type {
  EvmVerifyInfoLibraries,
  EvmVerifyInfoSourceFile,
} from "lib/types";
import { findAndDecodeEvmConstructorArgs } from "lib/utils";
import { ContractLibraryList } from "./ContractLibraryList";

interface ContractCodeProps {
  sourceFiles: EvmVerifyInfoSourceFile[];
  contractPath: string;
  constructorArguments: string;
  abi: JsonFragment[];
  libraries: EvmVerifyInfoLibraries;
}

export const ContractCode = ({
  sourceFiles,
  contractPath,
  constructorArguments,
  abi,
  libraries,
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
          libraryFilesPath={libraries.map((lib) => lib.contractPath)}
          initialFilePath={contractPath}
          isOpen={isOpen}
          onClose={onClose}
        />
      </Stack>
      {libraries.length > 0 && (
        <Stack gap={4}>
          <Flex gap={2} alignItems="center">
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
          <TextReadOnly text={foundConstructorArgs} canCopy />
        ) : (
          <Box>
            <Text py={4} px={3} rounded={8} bg="gray.900" color="text.disabled">
              No constructor arguments
            </Text>
          </Box>
        )}
      </Stack>
    </Stack>
  );
};
