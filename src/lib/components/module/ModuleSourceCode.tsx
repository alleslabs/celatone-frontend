import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";
import type { Monaco } from "@monaco-editor/react";
import MonacoEditor from "@monaco-editor/react";

import { CopyButton } from "../copy";
import type { Option } from "lib/types";

import { moveLanguageConfig, moveTokenProvider } from "./moveSyntax";

const loadMoveSyntax = (monaco: Monaco) => {
  monaco.languages.register({ id: "move" });
  monaco.languages.onLanguage("move", () => {
    monaco.languages.setMonarchTokensProvider("move", moveTokenProvider);
    monaco.languages.setLanguageConfiguration("move", moveLanguageConfig);
  });
};

interface ModuleSourceCodeProps {
  sourceCode: Option<string>;
}
export const ModuleSourceCode = ({ sourceCode }: ModuleSourceCodeProps) => {
  if (!sourceCode) return null;
  return (
    <Accordion allowToggle w="full" defaultIndex={[0]}>
      <AccordionItem>
        <AccordionButton p={4}>
          <Flex justifyContent="space-between" w="full">
            <Flex flexDirection="column" alignItems="start">
              <Text fontWeight={600} variant="body1" color="text.main">
                Module Source Code
              </Text>
              <Text
                fontWeight={600}
                variant="body2"
                color="text.dark"
                textAlign="start"
              >
                The source code is uploaded by the deployer and pulled from
                Initia API
              </Text>
            </Flex>
            <Flex alignItems="center" gap={2}>
              <CopyButton
                value={sourceCode}
                variant="outline-primary"
                w={{ base: "full", md: "auto" }}
              />
              <AccordionIcon color="gray.600" ml="auto" boxSize={6} />
            </Flex>
          </Flex>
        </AccordionButton>
        <AccordionPanel pt={0} pb={4}>
          <Box
            p="16px 12px"
            border="1px solid"
            borderColor="gray.700"
            borderRadius="8px"
          >
            <MonacoEditor
              height={400}
              language="move"
              theme="vs-dark"
              beforeMount={loadMoveSyntax}
              value={sourceCode}
              options={{ readOnly: true, scrollBeyondLastLine: false }}
            />
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
