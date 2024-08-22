import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDescription,
  Box,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import type { Monaco } from "@monaco-editor/react";
import MonacoEditor from "@monaco-editor/react";

import { AppLink } from "../AppLink";
import { CopyButton } from "../copy";
import { CustomIcon } from "../icon";
import { MoveVerifyBadge } from "../MoveVerifyBadge";
import { MoveVerifyStatus } from "lib/types";
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
  moveVerifyStatus: MoveVerifyStatus;
}

export const ModuleSourceCode = ({
  sourceCode,
  moveVerifyStatus,
}: ModuleSourceCodeProps) => {
  if (!sourceCode) return null;
  return (
    <Accordion allowToggle w="full" defaultIndex={[0]}>
      <AccordionItem>
        <AccordionButton p={4}>
          <Flex direction="column" w="full">
            <Flex justifyContent="space-between">
              <Flex flexDirection="column" alignItems="start">
                <Flex align="center" gap={1}>
                  <MoveVerifyBadge status={moveVerifyStatus} boxSize={4} />
                  <Heading as="h6" variant="h7">
                    Verified Module Source Code
                  </Heading>
                </Flex>
                <Text
                  fontWeight={600}
                  variant="body2"
                  color="text.dark"
                  textAlign="start"
                >
                  {/* TODO: Add timestamp */}
                  This module is verifed at Oct 24, 2022, 7:58:34 PM (UTC)
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
            {moveVerifyStatus === MoveVerifyStatus.Outdated && (
              <Alert
                p={2}
                variant="warning"
                gap={2}
                mt={2}
                alignItems="flex-start"
              >
                <CustomIcon name="alert-triangle-solid" boxSize={4} />
                <AlertDescription>
                  <Text variant="body2" color="warning.main" textAlign="left">
                    The displayed source code is an <b>older version</b> since
                    the module was republished after verification. If you are
                    the owner, you can{" "}
                    <AppLink href="/modules/verify">
                      <Text
                        display="inline-flex"
                        gap={1}
                        size="sm"
                        color="warning.main"
                        textDecoration="underline"
                        transition="all 0.25s ease-in-out"
                        _hover={{
                          color: "warning.light",
                          textDecorationColor: "warning.light",
                        }}
                      >
                        resubmit for verification
                      </Text>
                    </AppLink>{" "}
                    with the new files.
                  </Text>
                </AlertDescription>
              </Alert>
            )}
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
